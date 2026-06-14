// v3
import agents from '../../data/agents.json'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { genre, audience, overview, compTitles } = req.body
  if (!genre) return res.status(400).json({ error: 'Genre is required for matching.' })

  const openAgents = agents.filter(a => a.open)

  // Local keyword matching — fast, reliable, no AI needed
  const searchText = `${genre} ${audience || ''} ${overview || ''} ${compTitles || ''}`.toLowerCase()

  const scored = openAgents.map(agent => {
    let score = 0
    const agentText = `${agent.genres.join(' ')} ${agent.wishlist}`.toLowerCase()

    // Score by genre matches
    agent.genres.forEach(g => {
      if (searchText.includes(g.toLowerCase())) score += 2
    })

    // Score by wishlist keyword matches
    const wishlistWords = agent.wishlist.toLowerCase().split(/\s+/)
    const searchWords = searchText.split(/\s+/)
    wishlistWords.forEach(word => {
      if (word.length > 4 && searchWords.some(sw => sw.includes(word) || word.includes(sw))) {
        score += 0.5
      }
    })

    // Generate a reason
    const matchedGenres = agent.genres.filter(g => searchText.includes(g.toLowerCase()))
    const reason = matchedGenres.length > 0
      ? `Represents ${matchedGenres.slice(0, 2).join(' and ')} — aligns with your book's genre and audience.`
      : `Actively seeking nonfiction with strong narrative and commercial appeal.`

    return { ...agent, score: Math.min(10, Math.round(score * 10) / 10), reason }
  })

  // Sort by score, return all
  const sorted = scored.sort((a, b) => b.score - a.score)

  res.status(200).json({ agents: sorted })
}