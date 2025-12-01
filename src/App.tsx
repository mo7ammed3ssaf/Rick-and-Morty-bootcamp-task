import React, { createContext, useState, type ReactNode } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
const CharactersPage: React.FC = () => {
  return <div className="characters-page">Characters page placeholder</div>
}
const CharacterDetailsPage: React.FC = () => {
  return <div className="character-details-page">Character details page placeholder</div>
}
type AppState = Record<string, unknown>

const AppContext = createContext<{
  state: AppState
  setState: React.Dispatch<React.SetStateAction<AppState>>
} | undefined>(undefined)

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({})
  return <AppContext.Provider value={{ state, setState }}>{children}</AppContext.Provider>
}


export default function App() {
return (
<AppProvider>
<div className="app">
<header className="header">
<Link to="/" className="logo">Rick & Morty — Bootcamp Task</Link>
</header>
<main className="main">
<Routes>
<Route path="/" element={<CharactersPage />} />
<Route path="/character/:id" element={<CharacterDetailsPage />} />
</Routes>
</main>
</div>
</AppProvider>
)
}