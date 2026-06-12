import agents from '../../data/agents.json'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { genre, audience, overview, compTitles } = req.body
  if (!genre) return res.status(400).json({ error: 'Genre is required for matching.' })

  const openAgents = agents.filter(a => a.open)

  const agentSummaries = openAgents.map(a =>
    `ID:${a.id} | ${a.name} (${a.agency}) | Genres: ${a.genres.join(', ')} | Wishlist: ${a.wishlist.slice(0, 100)}`
  ).join('\n')

  const prompt = `You are a literary agent matching expert.

A nonfiction author is looking for representation:
- Genre: ${genre}
- Audience: ${audience || 'general readers'}
- Overview: ${overview?.slice(0, 300) || 'Not provided'}
- Comp titles: ${compTitles?.slice(0, 200) || 'Not provided'}

Available agents:
${agentSummaries}

Return ONLY a raw JSON array. No markdown, no backticks. Rank ALL agents by fit score (1-10), best first. Format:
[{"id":"1","score":8,"reason":"One sentence reason"},{"id":"2","score":7,"reason":"..."}]

Include every agent with a score. Return the full array.`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].text.trim()
    const start = raw.indexOf('[')
    const end = raw.lastIndexOf(']')

    if (start === -1 || end === -1) {
      console.error('No JSON array found:', raw.slice(0, 200))
      return res.status(500).json({ error: 'Could not match agents. Please try again.' })
    }

    const matches = JSON.parse(raw.slice(start, end + 1))

    const enriched = matches
      .map(match => {
        const agent = openAgents.find(a => a.id === match.id)
        if (!agent) return null
        return { ...agent, score: match.score, reason: match.reason }
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)

    res.status(200).json({ agents: enriched })
  } catch (e) {
    console.error('Match error:', e)
    res.status(500).json({ error: 'Could not match agents. Please try again.' })
  }
}