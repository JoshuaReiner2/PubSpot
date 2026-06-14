import Stripe from 'stripe'
import { clerkClient } from '@clerk/nextjs/server'

export const config = { api: { bodyParser: false } }

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const buf = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (e) {
    console.error('Webhook error:', e.message)
    return res.status(400).send(`Webhook Error: ${e.message}`)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const userId = session.metadata.userId
    const subscriptionId = session.subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0].price.id
    let plan = 'querying'
    if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) plan = 'pro'
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { plan, subscriptionId },
    })
  }

  res.status(200).json({ received: true })
}