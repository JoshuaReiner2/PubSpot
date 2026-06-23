import Head from 'next/head'
import Nav from '../components/Nav'
import styles from '../styles/Legal.module.css'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — PubSpot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Privacy Policy</h1>
          <p className={styles.date}>Last updated: June 2026</p>

          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly, including your name, email address, and manuscript content when you use PubSpot. We also collect usage data such as pages visited and features used.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use your information to provide and improve the Service, generate book proposals from your manuscript, match you with literary agents, send queries on your behalf when authorized, and communicate with you about the Service.</p>

          <h2>3. Manuscript Data</h2>
          <p>Your manuscript is processed by our AI system to generate proposals. We do not share your manuscript with third parties except as necessary to provide the Service (such as sending it to our AI processing provider). We do not use your manuscript to train AI models.</p>

          <h2>4. Agent Communications</h2>
          <p>When you use the auto-query feature, PubSpot sends emails to literary agents on your behalf. These emails include your contact information as the reply-to address. Agent email addresses in our database are publicly available professional contact information.</p>

          <h2>5. Data Storage</h2>
          <p>Your account information is stored securely. Proposals you generate are currently stored in your browser's local storage and are not retained on our servers beyond the processing necessary to generate them.</p>

          <h2>6. Third-Party Services</h2>
          <p>We use the following third-party services: Anthropic (AI processing), Clerk (authentication), Resend (email delivery), and Vercel (hosting). Each has its own privacy policy governing their data practices.</p>

          <h2>7. Data Security</h2>
          <p>We implement reasonable security measures to protect your information. However, no method of transmission over the internet is 100% secure.</p>

          <h2>8. Your Rights</h2>
          <p>You may request deletion of your account and associated data at any time by emailing <a href="mailto:hello@pubspot.ink">hello@pubspot.ink</a>.</p>

          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by email or through the Service.</p>

          <h2>10. Contact</h2>
          <p>Questions about privacy? Email us at <a href="mailto:hello@pubspot.ink">hello@pubspot.ink</a></p>
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="/">Home</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/terms">Terms of Service</a>
      </footer>
    </>
  )
}