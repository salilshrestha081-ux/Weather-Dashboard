import { useState, useEffect } from 'react'
import { useWeather } from './hooks/useWeather'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import ForecastList from './components/ForecastList'
import SearchHistory from './components/SearchHistory'
import StatusMessage from './components/StatusMessage'

const HISTORY_KEY = 'weather-dashboard-history'
const HISTORY_LIMIT = 6

export default function App() {
  const { weather, location, loading, error, fetchWeather, fetchByCoords } = useWeather()
  const [unit, setUnit] = useState('celsius')
  const [history, setHistory] = useState(() => {
    // Lazy init: read persisted history once on first render.
    try {
      const saved = localStorage.getItem(HISTORY_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist history to localStorage whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
    } catch {
      // localStorage may be unavailable (e.g. private browsing) — fail silently.
    }
  }, [history])

  function addToHistory(city) {
    setHistory((prev) => {
      const withoutDup = prev.filter((c) => c.toLowerCase() !== city.toLowerCase())
      return [city, ...withoutDup].slice(0, HISTORY_LIMIT)
    })
  }

  function handleSearch(city) {
    fetchWeather(city)
    addToHistory(city.trim())
  }

  function handleUseMyLocation() {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchByCoords(latitude, longitude, 'My Location')
      },
      () => alert('Unable to retrieve your location.')
    )
  }

  function toggleUnit() {
    setUnit((prev) => (prev === 'celsius' ? 'fahrenheit' : 'celsius'))
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌦️ Weather Dashboard</h1>
        <p>Search any city for live current conditions and a 5-day outlook.</p>
      </header>

      <SearchBar onSearch={handleSearch} disabled={loading} />

      <button className="location-btn" onClick={handleUseMyLocation} disabled={loading}>
        📍 Use my location
      </button>

      <SearchHistory
        history={history}
        onSelect={(city) => handleSearch(city)}
        onClear={() => setHistory([])}
      />

      <main className="app-main">
        {loading && <StatusMessage type="loading" />}
        {!loading && error && <StatusMessage type="error" message={error} />}
        {!loading && !error && !weather && <StatusMessage type="empty" />}

        {!loading && !error && weather && (
          <>
            <WeatherCard
              location={location}
              current={weather.current}
              unit={unit}
              onToggleUnit={toggleUnit}
            />
            <ForecastList daily={weather.daily} unit={unit} />
          </>
        )}
      </main>

      <footer className="app-footer">
  <p>Weather data provided by Open-Meteo.com</p>
  <p>Built with React and Vite</p>
</footer>
    </div>
  )
}
