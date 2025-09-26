import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import Container from 'react-bootstrap/Container'
import SearchBar from '../components/SearchBar'
import SpaceGrid from '../components/SpaceGrid'

export default function Home() {
  const [spaces, setSpaces] = useState([])
  const [query, setQuery] = useState('')

  useEffect(() => {
    let mounted = true
    axios.get('/data/spaces.json')
      .then(({ data }) => mounted && setSpaces(Array.isArray(data) ? data : []))
      .catch(() => setSpaces([]))
    return () => { mounted = false }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return spaces
    return spaces.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    )
  }, [spaces, query])

  return (
    <>
      {/* Hero full width background */}
      <div className="home-hero">
        <img
          src="/assets/hero/homebackground.jpg"
          alt="Background"
          className="home-hero__image"
        />
        <Container className="home-hero__content">
          <div className="home-hero__panel">
            <h1 className="hero-title mb-2">Find your next study spot</h1>
            <SearchBar query={query} setQuery={setQuery} />
          </div>
        </Container>
      </div>

      {/* Body grid */}
      <Container className="py-4">
        <SpaceGrid spaces={filtered} />
      </Container>
    </>
  )
}