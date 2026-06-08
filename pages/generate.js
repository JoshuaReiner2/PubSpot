import { useState, useCallback } from 'react'
import Head from 'next/head'
import { useDropzone } from 'react-dropzone'
import Nav from '../components/Nav'
import styles from '../styles/Generate.module.css'

const PROPOSAL_SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'hook', label: 'The Hook' },
  { key: 'market', label: 'Market Analysis' },
  { key: 'compTitles', label: 'Comparable Titles' },
  { key: 'authorPlatform', label: 'Author Platform' },
  { key: 'chapterOutline', label: 'Chapter Outline' },
  { key: 'samplePages', label: 'Sample Pages' },
]

export default function Generate() {
  const [step, setStep] = useState('upload') // upload | details | generating | proposal
  const [file, setFile] = useState(null)
  const [manuscriptText, setManuscriptText] = useState('')
  const [details, setDetails] = useState({ authorName: '', genre: '', audience: '', credentials: '' })
  const [proposal, setProposal] = useState(null)
  const [editedProposal, setEditedProposal] = useState(null)
  const [activeSection, setActiveSection] = useState('overview')
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')

  const onDrop = useCallback(async (acceptedFiles) => {
    const f = acceptedFiles[0]
    if (!f) return
    setFile(f)
    setError('')

    const formData = new FormData()
    formData.append('file', f)

    try {
      const res = await fetch('/api/extract-text', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) { setError(data.error); return }
      setManuscriptText(data.text)
      setStep('details')
    } catch (e) {
      setError('Could not read that file. Please try a .txt, .docx, or .pdf file.')
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  })

  const handleGenerate = async () => {
    setStep('generating')
    setProgress('Reading your manuscript...')
    setError('')

    try {
      setProgress('Analyzing themes and structure...')
      const res = await fetch('/api/generate-proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manuscriptText: manuscriptText.slice(0, 80000), details }),
      })

      setProgress('Drafting your proposal sections...')
      const data = await res.json()

      if (data.error) { setError(data.error); setStep('details'); return }

      setProposal(data.proposal)
      setEditedProposal(data.proposal)
      setStep('proposal')
    } catch (e) {
      setError('Something went wrong generating your proposal. Please try again.')
      setStep('details')
    }
  }

  const handleEdit = (key, value) => {
    setEditedProposal(prev => ({ ...prev, [key]: value }))
  }

  const handleDownload = () => {
    const sections = PROPOSAL_SECTIONS.map(s =>
      `## ${s.label}\n\n${editedProposal[s.key] || ''}`
    ).join('\n\n---\n\n')

    const content = `# Book Proposal\n\n${sections}`
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'book-proposal.txt'
    a.click()
  }

  return (
    <>
      <Head>
        <title>Generate Proposal — PubSpot</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />

      <main className={styles.main}>

        {/* STEP 1: UPLOAD */}
        {step === 'upload' && (
          <div className={styles.container}>
            <div className={styles.stepHeader}>
              <div className={styles.stepEyebrow}>Step 1 of 3</div>
              <h1>Upload your manuscript</h1>
              <p>We'll read your work and use it to draft your full book proposal. Supports PDF, Word (.docx), or plain text.</p>
            </div>

            <div {...getRootProps()} className={`${styles.dropzone} ${isDragActive ? styles.active : ''}`}>
              <input {...getInputProps()} />
              <div className={styles.dropIcon}>📄</div>
              <p className={styles.dropMain}>{isDragActive ? 'Drop it here' : 'Drag your manuscript here'}</p>
              <p className={styles.dropSub}>or click to browse — PDF, DOCX, or TXT up to 20MB</p>
            </div>

            {error && <p className={styles.error}>{error}</p>}
          </div>
        )}

        {/* STEP 2: DETAILS */}
        {step === 'details' && (
          <div className={styles.container}>
            <div className={styles.stepHeader}>
              <div className={styles.stepEyebrow}>Step 2 of 3</div>
              <h1>A few details</h1>
              <p>This helps us personalize your proposal. You can edit everything after it's generated.</p>
            </div>

            <div className={styles.fileConfirm}>
              <span className={styles.fileIcon}>✓</span>
              <span>{file?.name} — {Math.round(manuscriptText.length / 5)} words extracted</span>
            </div>

            <div className={styles.form}>
              <div className={styles.field}>
                <label>Your name</label>
                <input type="text" placeholder="e.g. Jane Smith" value={details.authorName}
                  onChange={e => setDetails(p => ({...p, authorName: e.target.value}))} />
              </div>
              <div className={styles.field}>
                <label>Genre / category</label>
                <input type="text" placeholder="e.g. Narrative nonfiction, Memoir, Business" value={details.genre}
                  onChange={e => setDetails(p => ({...p, genre: e.target.value}))} />
              </div>
              <div className={styles.field}>
                <label>Target audience</label>
                <input type="text" placeholder="e.g. General readers interested in psychology and culture" value={details.audience}
                  onChange={e => setDetails(p => ({...p, audience: e.target.value}))} />
              </div>
              <div className={styles.field}>
                <label>Your credentials & platform <span>(optional — AI will draft this, you can edit)</span></label>
                <textarea rows={4} placeholder="e.g. Former journalist, 10k newsletter subscribers, TEDx speaker, prior books..." value={details.credentials}
                  onChange={e => setDetails(p => ({...p, credentials: e.target.value}))} />
              </div>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.formActions}>
              <button className={styles.backBtn} onClick={() => setStep('upload')}>← Back</button>
              <button className={styles.generateBtn}
                onClick={handleGenerate}
                disabled={!details.authorName || !details.genre}>
                Generate my proposal →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: GENERATING */}
        {step === 'generating' && (
          <div className={styles.generating}>
            <div className={styles.spinner}></div>
            <h2>Drafting your proposal</h2>
            <p>{progress}</p>
            <div className={styles.progressSteps}>
              {['Reading manuscript', 'Analyzing argument', 'Finding comp titles', 'Drafting sections', 'Finishing up'].map((s, i) => (
                <div key={s} className={styles.progressStep} style={{animationDelay: `${i * 1.2}s`}}>{s}</div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: PROPOSAL */}
        {step === 'proposal' && editedProposal && (
          <div className={styles.proposalLayout}>
            <div className={styles.proposalSidebar}>
              <div className={styles.sidebarHeader}>
                <div className={styles.sidebarTitle}>Your proposal</div>
                <div className={styles.sidebarSub}>Click any section to edit</div>
              </div>
              <nav className={styles.sectionNav}>
                {PROPOSAL_SECTIONS.map(s => (
                  <button key={s.key}
                    className={`${styles.sectionBtn} ${activeSection === s.key ? styles.active : ''}`}
                    onClick={() => setActiveSection(s.key)}>
                    {s.label}
                  </button>
                ))}
              </nav>
              <div className={styles.sidebarActions}>
                <button className={styles.downloadBtn} onClick={handleDownload}>Download proposal</button>
                <button className={styles.restartBtn} onClick={() => { setStep('upload'); setProposal(null); setFile(null); }}>
                  Start new proposal
                </button>
              </div>
            </div>

            <div className={styles.proposalMain}>
              <div className={styles.proposalBanner}>
                <span>✦</span> Your proposal is ready. Edit any section below, then download when you're happy.
              </div>
              {PROPOSAL_SECTIONS.map(s => (
                <div key={s.key} className={`${styles.section} ${activeSection === s.key ? styles.sectionActive : ''}`}
                  id={s.key} onClick={() => setActiveSection(s.key)}>
                  <div className={styles.sectionLabel}>{s.label}</div>
                  <textarea
                    className={styles.sectionTextarea}
                    value={editedProposal[s.key] || ''}
                    onChange={e => handleEdit(s.key, e.target.value)}
                    rows={s.key === 'samplePages' ? 20 : s.key === 'chapterOutline' ? 16 : 8}
                    placeholder={`${s.label} will appear here...`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  )
}
