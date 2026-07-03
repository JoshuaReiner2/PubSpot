import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { agent, proposal, authorName, authorEmail } = req.body

  const prompt = `You are an expert at writing query letters to literary agents.

Write a personalized query letter from ${authorName} to ${agent.name} at ${agent.agency}.

AGENT WISHLIST: ${agent.wishlist}
AGENT GUIDELINES: ${agent.queryGuidelines}

BOOK DETAILS:
Hook: ${proposal.hook?.slice(0, 300)}
Overview: ${proposal.overview?.slice(0, 500)}
Market: ${proposal.market?.slice(0, 300)}
Comp titles: ${proposal.compTitles?.slice(0, 300)}
Author platform: ${proposal.authorPlatform?.slice(0, 300)}

Write a professional query letter of 3-4 paragraphs under 400 words. No markdown, plain text only. Sign off with the author's name.`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })

    const queryLetter = message.content[0].text.trim()
    res.status(200).json({ queryLetter })
  } catch (e) {
    console.error('Generate query letter error:', e)
    res.status(500).json({ error: 'Could not generate query letter. Please try again.' })
  }
}