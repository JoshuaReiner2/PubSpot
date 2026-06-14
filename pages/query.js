import { useState, useEffect } from 'react'
import Head from 'next/head'
import Nav from '../components/Nav'
import { useUser } from '@clerk/nextjs'
import styles from '../styles/Query.module.css'

export default function Query() {
  const { user } = useUser()
  const isAdmin = user?.publicMetadata?.role === 'admin'
  const userPlan = user?.publicMetadata?.plan
  const canQuery = isAdmin || userPlan === 'querying' || userPlan === 'pro'

  const [step, setStep] = useState('setup')
  const [proposal, setProposal] = useState(null)
  const [genre, setGenre] = useState('')
  const [audience, setAudience] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sentQueries, setSentQueries] = useState([])
  const [activeAgent, setActiveAgent] = useState(null)
  const [queryLetter, setQueryLetter] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (user?.emailAddresses?.[0]?.emailAddress) {
      setAuthorEmail(user.emailAddresses[0].emailAddress)
    }
    const saved = localStorage.getItem('pubspot_proposal')
    if (saved) {
      try {
        const p = JSON.parse(saved)
        setProposal(p)
        if (p.genre) setGenre(p.genre)
        if (p.audience) setAudience(p.audience)
      } catch(e) {}
    }
  }, [user])

  const handleMatch = async () => {
    if (!canQuery) {
      setError('Querying agents requires a paid plan. Upgrade at /pricing to get started.')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/match-agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genre,
          audience,
          overview: proposal?.overview,
          compTitles: proposal?.compTitles,
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setAgents(data.agents)
      setStep('agents')
    } catch (e) {
      setError('Could not match agents. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSendQuery = async (agent) => {
    setActiveAgent(agent)
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/send-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent,
          proposal,
          authorName: user?.fullName || 'Author',
          authorEmail,
        }),
      })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setQueryLetter(data.queryLetter)
      setSentQueries(prev => [...prev, {
        agent,
        method: data.method,
        sent: data.sent,
        submissionUrl: data.submissionUrl,
        queryLetter: data.queryLetter,
        date: new Date().toLocaleDateString(),
        status: data.sent ? 'Sent' : 'Ready to submit',
      }])
      if (data.method === 'form') {
        setStep('form-submit')
      } else {
        setStep('sent')
      }
    } catch (e) {
      setError('Could not send query. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Head>
        <title>Query Agents - PubSpot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />
      <main className={styles.main}>

        {step === 'setup' && (
          <div className={styles.container}>
            <div className={styles.stepHeader}>
              <div className={styles.eyebrow}>Agent matching</div>
              <h1>Find your agents</h1>
              <p>Tell us about your book and we'll match you with the agents most likely to be interested.</p>
            </div>

            {!canQuery && (
              <div className={styles.upgradePrompt}>
                Querying agents requires a paid plan.{' '}
                <a href="/pricing">Upgrade to get started</a>
              </div>
            )}

            {!proposal && (
              <div className={styles.warning}>
                No proposal found. <a href="/generate">Generate your proposal first</a>
              </div>
            )}

            <div className={styles.form}>
              <div className={styles.field}>
                <label>Genre / category</label>
                <input type="text" value={genre} onChange={e => setGenre(e.target.value)}
                  placeholder="e.g. Narrative nonfiction, Memoir, Business" />
              </div>
              <div className={styles.field}>
                <label>Target audience</label>
                <input type="text" value={audience} onChange={e => setAudience(e.target.value)}
                  placeholder="e.g. General readers interested in psychology and culture" />
              </div>
              <div className={styles.field}>
                <label>Your email (for reply-to on queries)</label>
                <input type="email" value={authorEmail} onChange={e => setAuthorEmail(e.target.value)}
                  placeholder="your@email.com" />
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.primaryBtn} onClick={handleMatch}
              disabled={loading || !genre}>
              {loading ? 'Finding matches...' : 'Find matching agents'}
            </button>
          </div>
        )}

        {step === 'agents' && (
          <div className={styles.container}>
            <div className={styles.stepHeader}>
              <div className={styles.eyebrow}>{agents.length} agents matched</div>
              <h1>Your agent matches</h1>
              <p>Ranked by fit. Review each agent and send your personalized query with one click.</p>
            </div>

            {sentQueries.length > 0 && (
              <div className={styles.sentBanner}>
                {sentQueries.length} {sentQueries.length === 1 ? 'query' : 'queries'} sent or ready to submit
              </div>
            )}

            <div className={styles.agentList}>
              {agents.map(agent => {
                const alreadySent = sentQueries.find(q => q.agent.id === agent.id)
                return (
                  <div key={agent.id} className={styles.agentCard}>
                    <div className={styles.agentHeader}>
                      <div>
                        <div className={styles.agentName}>{agent.name}</div>
                        <div className={styles.agentAgency}>{agent.agency}</div>
                      </div>
                      <div className={styles.agentScore}>
                        <div className={styles.scoreNum}>{agent.score}</div>
                        <div className={styles.scoreLabel}>match</div>
                      </div>
                    </div>
                    <p className={styles.agentReason}>{agent.reason}</p>
                    <div className={styles.agentMeta}>
                      <span className={styles.genreTags}>
                        {agent.genres.slice(0, 3).map(g => (
                          <span key={g} className={styles.tag}>{g}</span>
                        ))}
                      </span>
                      <span className={`${styles.methodBadge} ${agent.submissionMethod === 'email' ? styles.emailBadge : styles.formBadge}`}>
                        {agent.submissionMethod === 'email' ? 'Email' : 'Form'}
                      </span>
                    </div>
                    <p className={styles.guidelines}>{agent.queryGuidelines}</p>
                    {alreadySent ? (
                      <div className={styles.sentTag}>Done - {alreadySent.status}</div>
                    ) : (
                      <button className={styles.sendBtn}
                        onClick={() => handleSendQuery(agent)}
                        disabled={sending}>
                        {sending && activeAgent?.id === agent.id ? 'Preparing query...' : 'Send personalized query'}
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.backLink} onClick={() => setStep('setup')}>
              Back to search
            </button>
          </div>
        )}

        {step === 'sent' && (
          <div className={styles.container}>
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✓</div>
              <h2>Query sent to {activeAgent?.name}!</h2>
              <p>Your personalized query letter has been emailed to {activeAgent?.email}. They will reply directly to your email address.</p>
            </div>
            <div className={styles.letterPreview}>
              <div className={styles.letterLabel}>Your query letter</div>
              <pre className={styles.letterText}>{queryLetter}</pre>
            </div>
            <button className={styles.primaryBtn} onClick={() => setStep('agents')}>
              Back to agents
            </button>
          </div>
        )}

        {step === 'form-submit' && (
          <div className={styles.container}>
            <div className={styles.successBox}>
              <div className={styles.successIcon}>✦</div>
              <h2>Your query letter is ready</h2>
              <p>{activeAgent?.name} at {activeAgent?.agency} uses an online submission form. Copy your letter below and paste it into their form.</p>
              <a href={activeAgent?.submissionUrl} target="_blank" rel="noopener noreferrer"
                className={styles.formLink}>
                Open submission form
              </a>
            </div>
            <div className={styles.letterPreview}>
              <div className={styles.letterLabel}>Your personalized query letter - copy and paste into the form</div>
              <pre className={styles.letterText}>{queryLetter}</pre>
              <button className={styles.copyBtn}
                onClick={() => navigator.clipboard.writeText(queryLetter)}>
                Copy to clipboard
              </button>
            </div>
            <button className={styles.primaryBtn} onClick={() => setStep('agents')}>
              Back to agents
            </button>
          </div>
        )}

      </main>
    </>
  )
}