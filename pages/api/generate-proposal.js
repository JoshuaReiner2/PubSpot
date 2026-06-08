import Anthropic from '@anthropic-ai/sdk'

export const config = { api: { bodyParser: true, responseLimit: '8mb' } }

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { manuscriptText, details } = req.body
  if (!manuscriptText || manuscriptText.length < 200) {
    return res.status(400).json({ error: 'Manuscript text is too short or missing.' })
  }

  const { authorName, genre, audience, credentials } = details

  const prompt = `You are an expert literary agent and book proposal writer.

Given this nonfiction manuscript excerpt and author details, write a complete book proposal.

MANUSCRIPT:
${manuscriptText.slice(0, 60000)}

AUTHOR NAME: ${authorName}
GENRE: ${genre}
AUDIENCE: ${audience}
CREDENTIALS: ${credentials || 'Please infer from the writing and note the author should fill in platform details.'}

You MUST respond with ONLY a raw JSON object. No explanation, no markdown, no backticks. Just the JSON object starting with { and ending with }.

The JSON must have exactly these 7 keys:
- overview
- hook
- market
- compTitles
- authorPlatform
- chapterOutline
- samplePages

Each value must be a plain string. Keep each section to 2-4 paragraphs maximum.`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].text.trim()
    
    // Find the outermost { } 
    const start = raw.indexOf('{')
    const end = raw.lastIndexOf('}')
    
    if (start === -1 || end === -1) {
      console.error('No JSON braces found. Raw:', raw.slice(0, 300))
      return res.status(500).json({ error: 'The AI returned an unexpected format. Please try again.' })
    }
    
    const jsonStr = raw.slice(start, end + 1)
    
    let proposal
    try {
      proposal = JSON.parse(jsonStr)
    } catch (parseErr) {
      console.error('Parse failed:', parseErr.message, 'JSON str:', jsonStr.slice(0, 300))
      return res.status(500).json({ error: 'The AI returned an unexpected format. Please try again.' })
    }

    res.status(200).json({ proposal })

  } catch (e) {
    console.error('Anthropic API error:', e)
    if (e.status === 401) return res.status(500).json({ error: 'API key issue. Please check your Anthropic API key.' })
    if (e.status === 429) return res.status(500).json({ error: 'Rate limit reached. Please wait and try again.' })
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}