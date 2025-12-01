export type Character = {
id: number
name: string
status: string
species: string
type: string
gender: string
origin: { name: string; url: string }
location: { name: string; url: string }
image: string
episode: string[]
}


export type Episode = {
id: number
name: string
air_date: string
episode: string
}


const BASE = 'https://rickandmortyapi.com/api'


export async function fetchCharacters(name = '', page = 1) {
const q = new URLSearchParams()
if (name) q.set('name', name)
q.set('page', String(page))
const res = await fetch(`${BASE}/character/?${q.toString()}`)
if (!res.ok) {
const err = await res.json().catch(() => ({}))
throw new Error(err?.error || res.statusText)
}
return res.json()
}


export async function fetchCharacterById(id: string | number) {
const res = await fetch(`${BASE}/character/${id}`)
if (!res.ok) throw new Error('Character not found')
return res.json() as Promise<Character>
}


export async function fetchEpisodesByUrls(urls: string[]) {
if (urls.length === 0) return [] as Episode[]
// API supports multiple ids: /episode/1,2,3
const ids = urls.map(u => u.split('/').pop()).join(',')
const res = await fetch(`${BASE}/episode/${ids}`)
if (!res.ok) throw new Error('Failed to fetch episodes')
const data = await res.json()
return Array.isArray(data) ? data : [data]
}