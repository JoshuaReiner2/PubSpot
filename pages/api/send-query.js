import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { agent, authorEmail, queryLetter } = req.body

  try {
    if (agent.submissionMethod === 'email') {
      await resend.emails.send({
        from: 'PubSpot <queries@pubspot.ink>',
        to: agent.email,
        replyTo: authorEmail,
        subject: `Query: ${queryLetter.slice(0, 60).split('\n')[0]}`,
        text: queryLetter,
      })
      res.status(200).json({ sent: true, method: 'email' })
    } else {
      res.status(200).json({ sent: false, method: 'form', submissionUrl: agent.submissionUrl })
    }
  } catch (e) {
    console.error('Send query error:', e)
    res.status(500).json({ error: 'Could not send query. Please try again.' })
  }
}