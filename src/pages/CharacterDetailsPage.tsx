import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

type SimpleRef = { name: string }
type LocationRef = { name: string }

interface Character {
  id: number
  name: string
  status: string
  species: string
  gender: string
  image: string
  origin: SimpleRef
  location: LocationRef
  episode: string[] // URLs
}

interface Episode {
  id: number
  name: string
  air_date: string
  episode: string
}

export default function CharacterDetailsPage(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const [character, setCharacter] = useState<Character | null>(null)
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // simple in-memory cache for this page
  const cacheRef = useRef<Record<string, { character: Character; episodes: Episode[] }>>({})

  async function fetchCharacterById(id: string): Promise<Character> {
	const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`)
	if (!res.ok) throw new Error(`Character fetch failed: ${res.statusText}`)
	return (await res.json()) as Character
  }

  async function fetchEpisodesByUrls(urls: string[]): Promise<Episode[]> {
	if (!urls || urls.length === 0) return []
	// fetch all episodes in parallel
	const results = await Promise.all(urls.map(u => fetch(u).then(r => {
	  if (!r.ok) throw new Error(`Episode fetch failed: ${r.statusText}`)
	  return r.json()
	})))
	// API may return single object or array depending on endpoint; normalize to array
	return results.flat() as Episode[]
  }

  useEffect(() => {
	if (!id) return

	let cancelled = false
	const cacheKey = `character:${id}`

	setLoading(true)
	setError(null)

	const cached = cacheRef.current[cacheKey]
	if (cached) {
	  setCharacter(cached.character)
	  setEpisodes(cached.episodes || [])
	  setLoading(false)
	  return () => { cancelled = true }
	}

	fetchCharacterById(id)
	  .then(async (ch) => {
		if (cancelled) return
		setCharacter(ch)
		const eps = await fetchEpisodesByUrls(ch.episode)
		if (cancelled) return
		setEpisodes(eps)
		// cache
		cacheRef.current[cacheKey] = { character: ch, episodes: eps }
	  })
	  .catch(err => {
		if (!cancelled) setError(err?.message ?? String(err))
	  })
	  .finally(() => {
		if (!cancelled) setLoading(false)
	  })

	return () => { cancelled = true }
  }, [id])

  if (!id) return <div>Invalid character id</div>

  return (
	<div>
	  <Link to="/">← Back to list</Link>

	  {loading && <p>Loading...</p>}
	  {error && <p style={{ color: 'red' }}>{error}</p>}

	  {character && (
		<div className="details">
		  <img src={character.image} alt={character.name} />
		  <div className="info">
			<h2>{character.name}</h2>
			<p><strong>Status:</strong> {character.status}</p>
			<p><strong>Species:</strong> {character.species}</p>
			<p><strong>Gender:</strong> {character.gender}</p>
			<p><strong>Origin:</strong> {character.origin?.name}</p>
			<p><strong>Location:</strong> {character.location?.name}</p>
		  </div>
		</div>
	  )}

	  <section>
		<h3>Episodes ({episodes.length})</h3>
		<ul>
		  {episodes.map(e => (
			<li key={e.id}>{e.episode} — {e.name} (air: {e.air_date})</li>
		  ))}
		</ul>
	  </section>
	</div>
  )
}