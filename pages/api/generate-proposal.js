// v2
import Anthropic from '@anthropic-ai/sdk'

export const config = { api: { bodyParser: true, responseLimit: '16mb' } }

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { manuscriptText, details } = req.body
  if (!manuscriptText || manuscriptText.length < 200) {
    return res.status(400).json({ error: 'Manuscript text is too short or missing.' })
  }

  const { authorName, genre, audience, credentials } = details

  const prompt = `You are an expert literary agent and book proposal writer with 20+ years of experience placing major nonfiction books with top publishers like Penguin Random House, Simon & Schuster, HarperCollins, and others.

You have been given a nonfiction manuscript and author details. Write a COMPLETE, DETAILED, PROFESSIONAL book proposal that would impress a top literary agent. Each section must be thorough and substantive.

MANUSCRIPT:
${manuscriptText.slice(0, 50000)}

[MIDDLE SECTION]:
${manuscriptText.slice(Math.floor(manuscriptText.length / 2) - 5000, Math.floor(manuscriptText.length / 2) + 5000)}

[FINAL SECTION]:
${manuscriptText.slice(-10000)}

AUTHOR NAME: ${authorName}
GENRE/CATEGORY: ${genre}
TARGET AUDIENCE: ${audience}
AUTHOR CREDENTIALS/PLATFORM: ${credentials || 'Please infer from the writing style and content. Note the author should fill in specific platform details in brackets.'}

Write a complete, detailed book proposal. Be specific - use real details, arguments, themes, characters, and examples from the actual manuscript text provided above.

Return ONLY a raw JSON object (no markdown, no backticks, just the JSON). Each value must be a detailed string with multiple paragraphs where appropriate:

{
  "overview": "DETAILED 4-6 paragraph overview. Open with a compelling hook sentence. Describe the book's central argument or narrative. Explain why this book matters now and what makes it unique. Describe the reading experience. End with the book's impact. Minimum 400 words.",
  "hook": "ONE powerful, memorable paragraph of 100-150 words that captures the essence of the book. This is what an agent reads in the first 30 seconds. Make it irresistible.",
  "market": "DETAILED 3-4 paragraph market analysis. Paragraph 1: Primary audience with specific demographics. Paragraph 2: Secondary audiences. Paragraph 3: Market size, trends, and why this book is timely. Paragraph 4: How the author will reach these readers. Minimum 300 words.",
  "compTitles": "5-7 comparable titles. For each use this format: TITLE (Year) by Author, Publisher - Sales/awards if known. One paragraph explaining similarity AND key difference. Choose only real, recent (last 5 years preferred) books that genuinely compare. Minimum 400 words total.",
  "authorPlatform": "DETAILED 3-4 paragraph author platform section. Cover: expertise and credentials, writing background and publications, platform (social media, newsletter, speaking - use [brackets] for specific numbers the author should fill in), and why this author is uniquely qualified to write this book. Minimum 250 words.",
  "chapterOutline": "DETAILED chapter-by-chapter outline. For each chapter include: Chapter number and title, then 3-5 sentences describing the chapter's argument, key content, stories or examples covered, and how it advances the book's overall thesis. Cover ALL chapters visible in the manuscript. Minimum 600 words.",
  "samplePages": "The opening 5-7 pages of the manuscript, presented as polished sample pages. Include the full opening as it appears in the manuscript, lightly edited for presentation. This should read as a compelling excerpt that makes an agent want to read more."
}`

  try {
   const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8000,
      system: 'You are a JSON API. You output ONLY raw JSON with no markdown, no backticks, no code fences, no explanation. Your entire response must start with { and end with }. Never use ```json or ``` in your response.',
      messages: [{ role: 'user', content: prompt }],
    })

 const raw = message.content[0].text.trim()
    
    // Try multiple JSON extraction strategies
    let proposal
    
    // Strategy 1: find outermost { }
    const cleaned = raw.replace(/`{3}json/gi, '').replace(/`{3}/g, '').trim()
    const start = cleaned.indexOf('{')
    const end = cleaned.lastIndexOf('}')
    
    if (start === -1 || end === -1) {
      console.error('Raw response first 500 chars:', JSON.stringify(raw.slice(0, 500)))
      return res.status(500).json({ error: 'The AI returned an unexpected format. Please try again.' })
    }
    
    const jsonStr = cleaned.slice(start, end + 1)
    
    try {
      proposal = JSON.parse(jsonStr)
    } catch (parseErr) {
      // Strategy 2: try to fix common JSON issues
      try {
        const fixed = jsonStr
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, ' ')
          .replace(/\n/g, '\\n')
          .replace(/\r/g, '\\r')
          .replace(/\t/g, '\\t')
        proposal = JSON.parse(fixed)
      } catch (e2) {
        console.error('Both parse strategies failed:', parseErr.message)
        return res.status(500).json({ error: 'The AI returned an unexpected format. Please try again.' })
      }
    }

    res.status(200).json({ proposal })
  } catch (e) {
    console.error('Anthropic API error:', e)
    if (e.status === 401) return res.status(500).json({ error: 'API key issue. Please check your Anthropic API key.' })
    if (e.status === 429) return res.status(500).json({ error: 'Rate limit reached. Please wait and try again.' })
    res.status(500).json({ error: 'Something went wrong. Please try again.' })
  }
}