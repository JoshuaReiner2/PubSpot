# PubSpot

AI-powered book proposal generator and agent querying platform for nonfiction writers.

## What this does

1. Writer uploads their manuscript (PDF, DOCX, or TXT)
2. AI reads the manuscript and generates a full professional book proposal
3. Writer reviews and edits every section
4. Writer downloads the finished proposal

## Deploy to Vercel (step by step)

### 1. Push to GitHub

- Go to github.com and create a new repository called `pubspot`
- Upload all these files to that repository

### 2. Connect to Vercel

- Go to vercel.com and click "Add New Project"
- Import your `pubspot` GitHub repository
- Vercel will detect it's a Next.js app automatically

### 3. Add your API key

- In Vercel, before deploying, click "Environment Variables"
- Add: Name = `ANTHROPIC_API_KEY`, Value = your key from console.anthropic.com
- Click Save

### 4. Deploy

- Click Deploy
- Vercel will build and deploy your app
- You'll get a URL like `pubspot.vercel.app`

## Local development

```bash
npm install
cp .env.example .env.local
# Add your API key to .env.local
npm run dev
# Open http://localhost:3000
```

## Project structure

```
pages/
  index.js          — Landing page
  generate.js       — Proposal generator app
  api/
    extract-text.js — Reads uploaded manuscript files
    generate-proposal.js — Calls Claude to write the proposal
components/
  Nav.js / Nav.module.css
styles/
  globals.css
  Home.module.css
  Generate.module.css
```
