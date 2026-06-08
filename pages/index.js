import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/Nav'
import styles from '../styles/Home.module.css'

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
        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.eyebrow}>For nonfiction authors</div>
            <h1>Your manuscript deserves<br/>to be <em>published.</em></h1>
            <p className={styles.sub}>PubSpot turns your manuscript into a professional book proposal and automatically queries the right agents — so you can spend less time on paperwork and more time writing.</p>
            <Link href="/generate" className={styles.cta}>Generate your proposal →</Link>
            <p className={styles.note}>Free to start. No credit card required.</p>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.card}>
              <div className={styles.cardLabel}>Generated proposal</div>
              <div className={styles.cardTitle}>The Architecture of Grief:<br/>How Cities Shape How We Mourn</div>
              <div className={styles.lines}>
                <div className={styles.line} style={{width:'100%'}}></div>
                <div className={styles.line} style={{width:'85%'}}></div>
                <div className={styles.line} style={{width:'100%'}}></div>
                <div className={styles.line} style={{width:'60%'}}></div>
              </div>
              <hr className={styles.divider}/>
              <div className={styles.badge}>✓ Matched to 24 agents</div>
            </div>
            <div className={`${styles.pill} ${styles.pill1}`}>✦ Proposal drafted in 2 min</div>
            <div className={`${styles.pill} ${styles.pill2}`}>✓ 6 requests received</div>
          </div>
        </section>

        {/* PAIN */}
        <section className={styles.pain}>
          <h2>Writing the book was the <strong>easy part.</strong></h2>
          <p>Most nonfiction authors spend 6–18 months in the querying trenches — writing proposals from scratch, researching hundreds of agents, and sending emails into the void. PubSpot changes that.</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <div className={styles.statNum}>40+</div>
              <div className={styles.statLabel}>Hours the average author spends writing a nonfiction proposal</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>300+</div>
              <div className={styles.statLabel}>Agents a typical author queries before finding representation</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statNum}>18mo</div>
              <div className={styles.statLabel}>Average time from finished manuscript to signed deal</div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className={styles.how}>
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

        {/* CTA */}
        <section className={styles.ctaSection}>
          <h2>Your book is <em>ready.</em><br/>Now let's find it a home.</h2>
          <p>Generate a full professional proposal from your manuscript in minutes.</p>
          <Link href="/generate" className={styles.ctaBtn}>Get started free →</Link>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>Pub<span>Spot</span></div>
        <p>© 2026 PubSpot. Built for nonfiction writers.</p>
        <a href="mailto:hello@pubspot.com">hello@pubspot.com</a>
      </footer>
    </>
  )
}
