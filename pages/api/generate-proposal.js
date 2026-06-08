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

  const prompt = `You are an expert literary agent and book proposal writer with 20+ years of experience placing nonfiction books with major publishers.

You have been given a nonfiction manuscript and author details. Your job is to write a compelling, professional book proposal that will get agents and publishers excited.

MANUSCRIPT (first portion):
${manuscriptText.slice(0, 70000)}

AUTHOR NAME: ${authorName}
GENRE/CATEGORY: ${genre}
TARGET AUDIENCE: ${audience}
AUTHOR CREDENTIALS/PLATFORM: ${credentials || 'Please infer from the writing style and content, and note that the author should fill in specific platform details.'}

Write a complete book proposal with ALL of these sections. Be specific, compelling, and professional. Use the actual content of the manuscript — real arguments, examples, chapter topics, and themes you find in the text.

Return ONLY a valid JSON object with exactly these keys (no markdown, no backticks, just raw JSON):
{
  "overview": "2-3 paragraphs. The big idea, why it matters now, what the reader will get. Open with a hook.",
  "hook": "1 powerful paragraph that distills the essence of the book into its most compelling form. This is what an agent reads first.",
  "market": "2 paragraphs on the target readership, market size, and why this book is timely. Be specific.",
  "compTitles": "4-6 comparable titles published in the last 5 years. For each: Title (Year) by Author — one sentence on how this book is similar and how it differs. Choose real books that genuinely compare.",
  "authorPlatform": "Description of the author's credentials, expertise, platform, and why they are uniquely qualified to write this book. If specific platform data (social followers, newsletter size) was not provided, include placeholders in [brackets] for the author to fill in.",
  "chapterOutline": "A chapter-by-chapter summary. For each chapter: Chapter title and 2-3 sentence summary of its argument and content. Base this on the actual manuscript content.",
  "samplePages": "The opening 3-5 pages of the manuscript, lightly polished for proposal presentation."
}`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content[0].text.trim()

    // Strip any accidental markdown fences
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

    let proposal
    try {
      proposal = JSON.parse(cleaned)
    } catch (parseErr) {
      console.error('JSON parse error:', parseErr, '\nRaw:', raw.slice(0, 500))
      return res.status(500).json({ error: 'The AI returned an unexpected format. Please try again.' })
    }

    res.status(200).json({ proposal })

  } catch (e) {
    console.error('Anthropic API error:', e)
    if (e.status === 401) return res.status(500).json({ error: 'API key issue. Please check your Anthropic API key in Vercel environment variables.' })
    if (e.status === 429) return res.status(500).json({ error: 'Rate limit reached. Please wait a moment and try again.' })
    res.status(500).json({ error: 'Something went wrong generating your proposal. Please try again.' })
  }
}
