import { Resend } from 'resend'
import Anthropic from '@anthropic-ai/sdk'

const resend = new Resend(process.env.RESEND_API_KEY)
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { agent, proposal, authorName, authorEmail } = req.body

  // Generate personalized query letter
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

Write a professional, compelling query letter of 3-4 paragraphs. 
- Open with a hook that connects to this agent's specific interests
- Summarize the book compellingly
- Include comp titles naturally
- Close with author credentials
- Keep it under 400 words
- Do not use any markdown formatting, just plain text`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      messages: [{ role: 'user', content: prompt }],
    })

    const queryLetter = message.content[0].text.trim()

    if (agent.submissionMethod === 'email') {
      await resend.emails.send({
        from: 'PubSpot <queries@pubspot.ink>',
        to: agent.email,
        replyTo: authorEmail,
        subject: `Query: ${proposal.hook?.slice(0, 60) || 'Book Query'}`,
        text: queryLetter,
      })
      res.status(200).json({ sent: true, method: 'email', queryLetter })
    } else {
      res.status(200).json({ sent: false, method: 'form', queryLetter, submissionUrl: agent.submissionUrl })
    }
  } catch (e) {
    console.error('Send query error:', e)
    res.status(500).json({ error: 'Could not send query. Please try again.' })
  }
}