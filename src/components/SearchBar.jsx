import { useState } from 'react'

/**
 * Controlled search form.
 * Props:
 *  - onSearch(city: string): callback fired when the user submits a city
 *  - disabled: bool, disables the input/button while a request is in flight
 */
export default function SearchBar({ onSearch, disabled }) {
  const [city, setCity] = useState('')

  function handleChange(e) {
    setCity(e.target.value)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!city.trim()) return
    onSearch(city)
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={city}
        onChange={handleChange}
        placeholder="Search for a city (e.g. Kathmandu, London, Tokyo)"
        aria-label="City name"
        disabled={disabled}
        autoComplete="off"
        spellCheck="false"
      />
      <button type="submit" disabled={disabled}>
        {disabled ? 'Searching…' : 'Search'}
      </button>
    </form>
  )
}
