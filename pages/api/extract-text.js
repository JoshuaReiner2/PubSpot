import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const form = formidable({ maxFileSize: 20 * 1024 * 1024 })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(400).json({ error: 'Could not parse file upload.' })

    const file = Array.isArray(files.file) ? files.file[0] : files.file
    if (!file) return res.status(400).json({ error: 'No file received.' })

    const ext = path.extname(file.originalFilename || '').toLowerCase()

    try {
      let text = ''

      if (ext === '.txt') {
        text = fs.readFileSync(file.filepath, 'utf8')

      } else if (ext === '.docx') {
        const mammoth = require('mammoth')
        const result = await mammoth.extractRawText({ path: file.filepath })
        text = result.value

      } else if (ext === '.pdf') {
        const pdfParse = require('pdf-parse')
        const dataBuffer = fs.readFileSync(file.filepath)
        const data = await pdfParse(dataBuffer)
        text = data.text

      } else {
        return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.' })
      }

      if (!text || text.trim().length < 100) {
        return res.status(400).json({ error: 'The file appears to be empty or could not be read. Please try a different file.' })
      }

      res.status(200).json({ text: text.slice(0, 200000) })

    } catch (e) {
      console.error('Text extraction error:', e)
      res.status(500).json({ error: 'Could not extract text from this file. Please try a .txt version.' })
    }
  })
}
