import Head from 'next/head'
import Nav from '../components/Nav'
import { useUser } from '@clerk/nextjs'
import styles from '../styles/Pricing.module.css'

export default function Pricing() {
  const { user } = useUser()

  const handleCheckout = async (priceId) => {
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  const plan = user?.publicMetadata?.plan
  const isAdmin = user?.publicMetadata?.role === 'admin'

  return (
    <>
      <Head>
        <title>Pricing — PubSpot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />
      <main className={styles.main}>
        <div className={styles.header}>
          <div className={styles.eyebrow}>Pricing</div>
          <h1>Simple pricing for every stage of your journey.</h1>
          <p>Start free. Upgrade when you're ready to query.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.plan}>
            <div className={styles.planName}>Free</div>
            <div className={styles.planPrice}>$0<span>/mo</span></div>
            <p className={styles.planDesc}>Generate and preview your proposal.</p>
            <ul className={styles.features}>
              <li>1 proposal generation</li>
              <li>Full editing and preview</li>
              <li>Download your proposal</li>
              <li>No auto-querying</li>
            </ul>
            <div className={styles.currentBtn}>Your current plan</div>
          </div>

          <div className={`${styles.plan} ${styles.featured}`}>
            <div className={styles.badge}>Most popular</div>
            <div className={styles.planName}>Querying</div>
            <div className={styles.planPrice}>$29<span>/mo</span></div>
            <p className={styles.planDesc}>For authors actively querying agents.</p>
            <ul className={styles.features}>
              <li>Unlimited proposals</li>
              <li>50 queries / month</li>
              <li>Full agent database</li>
              <li>Query tracking dashboard</li>
              <li>Response notifications</li>
            </ul>
            {plan === 'querying' || plan === 'pro' ? (
              <div className={styles.currentBtn}>Current plan</div>
            ) : (
              <button className={styles.upgradeBtn}
                onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_QUERYING_PRICE_ID)}>
                Upgrade to Querying
              </button>
            )}
          </div>

          <div className={styles.plan}>
            <div className={styles.planName}>Pro</div>
            <div className={styles.planPrice}>$69<span>/mo</span></div>
            <p className={styles.planDesc}>For authors at high query volume.</p>
            <ul className={styles.features}>
              <li>Everything in Querying</li>
              <li>200 queries / month</li>
              <li>Multiple projects</li>
              <li>Priority agent matching</li>
              <li>Analytics dashboard</li>
            </ul>
            {plan === 'pro' ? (
              <div className={styles.currentBtn}>Current plan</div>
            ) : (
              <button className={styles.upgradeBtn}
                onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID)}>
                Upgrade to Pro
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  )
}