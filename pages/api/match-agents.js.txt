import agents from '../../data/agents.json'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { genre, audience, overview, compTitles } = req.body

  if (!genre) return res.status(400).json({ error: 'Genre is required for matching.' })

  const openAgents = agents.filter(a => a.open)

  const prompt = `You are a literary agent matching expert.

A nonfiction author is looking for representation. Here are their book details:
- Genre: ${genre}
- Target audience: ${audience}
- Overview: ${overview?.slice(0, 500) || 'Not provided'}
- Comp titles: ${compTitles?.slice(0, 300) || 'Not provided'}

Here is the list of available agents as JSON:
${JSON.stringify(openAgents.map(a => ({ id: a.id, name: a.name, agency: a.agency, genres: a.genres, wishlist: a.wishlist })))}

Return ONLY a raw JSON array (no markdown, no backticks) of the top agents ranked by fit, best match first.
Each item must have: id, score (1-10), reason (one sentence why they are a good match).
Include all agents with a score of 5 or above.`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].text.trim()
    const start = raw.indexOf('[')
    const end = raw.lastIndexOf(']')
    const matches = JSON.parse(raw.slice(start, end + 1))

    const enriched = matches.map(match => {
      const agent = openAgents.find(a => a.id === match.id)
      return { ...agent, score: match.score, reason: match.reason }
    }).filter(Boolean)

    res.status(200).json({ agents: enriched })
  } catch (e) {
    console.error('Match error:', e)
    res.status(500).json({ error: 'Could not match agents. Please try again.' })
  }
}