import { Document, Paragraph, TextRun, HeadingLevel, Packer, AlignmentType, BorderStyle } from 'docx'

export const config = { api: { bodyParser: true, responseLimit: '8mb' } }

const SECTIONS = [
  { key: 'overview', label: 'Overview' },
  { key: 'hook', label: 'The Hook' },
  { key: 'market', label: 'Market Analysis' },
  { key: 'compTitles', label: 'Comparable Titles' },
  { key: 'authorPlatform', label: 'Author Platform' },
  { key: 'chapterOutline', label: 'Chapter Outline' },
  { key: 'samplePages', label: 'Sample Pages' },
]

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { proposal } = req.body

  const children = [
    new Paragraph({
      text: 'BOOK PROPOSAL',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      text: 'Prepared with PubSpot',
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      run: { color: '888888' },
    }),
  ]

  for (const section of SECTIONS) {
    const content = proposal[section.key] || ''
    if (!content) continue

    // Section heading
    children.push(
      new Paragraph({
        text: section.label,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: 'C94F2A' },
        },
      })
    )

    // Section content — split by newlines into paragraphs
    const paragraphs = content.split('\n').filter(p => p.trim())
    for (const para of paragraphs) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: para,
              size: 24,
              font: 'Georgia',
            }),
          ],
          spacing: { after: 200 },
          alignment: AlignmentType.LEFT,
        })
      )
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Georgia', size: 24, color: '1A1614' },
          paragraph: { spacing: { line: 360 } },
        },
      },
    },
    sections: [{ properties: {}, children }],
  })

  const buffer = await Packer.toBuffer(doc)

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  res.setHeader('Content-Disposition', 'attachment; filename=book-proposal.docx')
  res.send(buffer)
}