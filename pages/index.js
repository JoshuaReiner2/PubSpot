import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/Nav'
import styles from '../styles/Home.module.css'

import { useUser } from '@clerk/nextjs'

function GetStartedBtn() {
  const { isSignedIn } = useUser()
  return (
    <a href={isSignedIn ? '/generate' : '/sign-up'} className={styles.cta}>
      {isSignedIn ? 'Generate a proposal →' : 'Get started free →'}
    </a>
  )
}
export default function Home() {
  return (
    <>
      <Head>
        <title>PubSpot — From Manuscript to Agent, Effortlessly</title>
        <meta name="description" content="PubSpot turns your nonfiction manuscript into a professional book proposal and automatically queries the right agents." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Nav />

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>For nonfiction authors</div>
            <h1>Your manuscript deserves<br/>to be <em>published.</em></h1>
            <p className={styles.sub}>PubSpot turns your manuscript into a professional book proposal and automatically queries the right agents — so you can spend less time on paperwork and more time writing.</p>
            <GetStartedBtn />
            <p className={styles.note}>Free to start. No credit card required.</p>
          </div>
        </section>

        <section className={styles.pain}>
          <h2>Writing the book was the <strong>easy part.</strong></h2>
          <p>Most nonfiction authors spend 6–18 months in the querying trenches — writing proposals from scratch, researching hundreds of agents, and sending emails into the void. PubSpot changes that.</p>
          <div className={styles.stats}>
            <div className={styles.stat}><div className={styles.statNum}>40+</div><div className={styles.statLabel}>Hours the average author spends writing a nonfiction proposal</div></div>
            <div className={styles.stat}><div className={styles.statNum}>300+</div><div className={styles.statLabel}>Agents a typical author queries before finding representation</div></div>
            <div className={styles.stat}><div className={styles.statNum}>18mo</div><div className={styles.statLabel}>Average time from finished manuscript to signed deal</div></div>
          </div>
        </section>

        <section className={styles.how} id="how">
          <div className={styles.sectionLabel}>How it works</div>
          <h2 className={styles.sectionTitle}>From manuscript to agent inbox in minutes.</h2>
          <div className={styles.steps}>
            {[
              { num: '01', title: 'Upload your manuscript', body: 'Drop in your draft — PDF, Word, or plain text. PubSpot reads your work and extracts your argument, structure, audience, and competitive positioning automatically.' },
              { num: '02', title: 'Review your proposal', body: 'PubSpot drafts a full book proposal — overview, hook, chapter summaries, comp titles, market analysis, and sample pages. You review, edit, and approve before anything is sent.' },
              { num: '03', title: 'Query on autopilot', body: 'PubSpot matches your book to agents actively seeking your genre, personalizes each query letter to their stated wishlist, and sends them automatically.' },
            ].map(s => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNum}>{s.num}</div>
                <div className={styles.stepBar}></div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.pricing} id="pricing">
          <div className={styles.sectionLabel} style={{textAlign:'center'}}>Pricing</div>
          <h2 className={styles.sectionTitle} style={{textAlign:'center', margin:'0 auto 48px'}}>Simple pricing for every stage of your journey.</h2>
          <div className={styles.pricingGrid}>
            <div className={styles.plan}>
              <div className={styles.planName}>Free</div>
              <div className={styles.planPrice}>$0<span>/mo</span></div>
              <p className={styles.planDesc}>Generate and preview your proposal. No querying until you upgrade.</p>
              <ul className={styles.planFeatures}>
                <li>1 proposal generation</li>
                <li>Full editing and preview</li>
                <li>Download your proposal</li>
                <li>No auto-querying</li>
              </ul>
              <Link href="/sign-up" className={styles.planBtn}>Get started</Link>
            </div>
            <div className={`${styles.plan} ${styles.planFeatured}`}>
              <div className={styles.planBadge}>Most popular</div>
              <div className={styles.planName}>Querying</div>
              <div className={styles.planPrice}>$29<span>/mo</span></div>
              <p className={styles.planDesc}>For authors actively in the querying trenches.</p>
              <ul className={styles.planFeatures}>
                <li>Unlimited proposals</li>
                <li>50 queries / month</li>
                <li>Full agent database</li>
                <li>Query tracking dashboard</li>
                <li>Response notifications</li>
              </ul>
              <Link href="/sign-up" className={styles.planBtn}>Get started</Link>
            </div>
            <div className={styles.plan}>
              <div className={styles.planName}>Pro</div>
              <div className={styles.planPrice}>$69<span>/mo</span></div>
              <p className={styles.planDesc}>For authors managing multiple projects at high volume.</p>
              <ul className={styles.planFeatures}>
                <li>Everything in Querying</li>
                <li>200 queries / month</li>
                <li>Multiple projects</li>
                <li>Priority agent matching</li>
                <li>Analytics dashboard</li>
              </ul>
              <Link href="/sign-up" className={styles.planBtn}>Get started</Link>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <h2>Your book is <em>ready.</em><br/>Now let's find it a home.</h2>
          <p>Generate a full professional proposal from your manuscript in minutes.</p>
          <GetStartedBtn />
        </section>
      </main>

<footer className={styles.footer}>
  <div className={styles.footerLogo}>Pub<span>Spot</span></div>
  <p>© 2026 PubSpot. Built for nonfiction writers.</p>
  <div className={styles.footerLinks}>
    <a href="mailto:hello@pubspot.ink">hello@pubspot.ink</a>
    <a href="/terms">Terms</a>
    <a href="/privacy">Privacy</a>
  </div>
</footer>
    </>
  )
}