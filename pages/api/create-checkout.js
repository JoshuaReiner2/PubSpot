import Stripe from 'stripe'
import { getAuth } from '@clerk/nextjs/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { userId } = getAuth(req)
  if (!userId) return res.status(401).json({ error: 'Not authenticated' })

  const { priceId } = req.body
  if (!priceId) return res.status(400).json({ error: 'Price ID required' })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${req.headers.origin}/dashboard?success=true`,
      cancel_url: `${req.headers.origin}/pricing`,
      metadata: { userId },
    })

    res.status(200).json({ url: session.url })
  } catch (e) {
    console.error('Stripe error:', e)
    res.status(500).json({ error: 'Could not create checkout session.' })
  }
}