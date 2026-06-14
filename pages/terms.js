import Head from 'next/head'
import Nav from '../components/Nav'
import styles from '../styles/Legal.module.css'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — PubSpot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1>Terms of Service</h1>
          <p className={styles.date}>Last updated: June 2026</p>

          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using PubSpot ("the Service"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service.</p>

          <h2>2. Description of Service</h2>
          <p>PubSpot is an AI-powered platform that helps nonfiction authors generate book proposals and identify literary agents. The Service uses artificial intelligence to analyze manuscripts and produce proposal drafts for review and editing by the author.</p>

          <h2>3. No Guarantee of Representation</h2>
          <p>PubSpot does not guarantee that use of the Service will result in literary representation, a publishing deal, or any other outcome. Agent information in our database is provided for informational purposes only. Agent preferences, availability, and submission requirements change frequently. Users are responsible for verifying current submission guidelines directly with agents before querying.</p>

          <h2>4. User Responsibilities</h2>
          <p>You represent that you are the author of any manuscript you upload, or that you have the right to use such material. You are responsible for reviewing and editing all AI-generated content before sending it to agents. By using the auto-query feature, you authorize PubSpot to send communications on your behalf to literary agents.</p>

          <h2>5. Intellectual Property</h2>
          <p>You retain full ownership of your manuscript and any proposals generated from it. PubSpot does not claim any rights to your work. The PubSpot platform, including its design, code, and branding, is owned by PubSpot and may not be copied or reproduced.</p>

          <h2>6. Privacy</h2>
          <p>Your use of the Service is also governed by our Privacy Policy, which is incorporated into these Terms by reference.</p>

          <h2>7. Disclaimer of Warranties</h2>
          <p>The Service is provided "as is" without warranties of any kind. PubSpot does not warrant that the Service will be uninterrupted, error-free, or that AI-generated content will be accurate or suitable for any particular purpose.</p>

          <h2>8. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, PubSpot shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.</p>

          <h2>9. Changes to Terms</h2>
          <p>We may update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.</p>

          <h2>10. Contact</h2>
          <p>Questions about these Terms? Email us at <a href="mailto:hello@pubspot.com">hello@pubspot.com</a></p>
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