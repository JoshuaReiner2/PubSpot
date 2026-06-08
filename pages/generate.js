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
  const [step, setStep] = useState('upload')
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
      if (data.error) { setError(data.error);
