import { useState, useEffect, useCallback } from 'react'

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'

/**
 * Custom hook that looks up a city and fetches its current weather + a
 * short daily forecast from the free Open-Meteo API (no API key required).
 *
 * Exposes: weather, location, loading, error, fetchWeather(cityName),
 * fetchByCoords(lat, lon, label)
 */
export function useWeather() {
  const [weather, setWeather] = useState(null)
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchByCoords = useCallback(async (lat, lon, label) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min',
        timezone: 'auto',
      })
      const res = await fetch(`${FORECAST_URL}?${params.toString()}`)
      if (!res.ok) throw new Error('Could not load weather data. Please try again.')
      const data = await res.json()
      setWeather(data)
      setLocation(label)
    } catch (err) {
      setError(err.message || 'Something went wrong fetching the weather.')
      setWeather(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWeather = useCallback(
    async (cityName) => {
      const trimmed = cityName.trim()
      if (!trimmed) {
        setError('Please enter a city name.')
        return
      }
      setLoading(true)
      setError(null)
      try {
        const geoRes = await fetch(
          `${GEOCODE_URL}?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`
        )
        if (!geoRes.ok) throw new Error('City lookup failed. Please try again.')
        const geoData = await geoRes.json()

        if (!geoData.results || geoData.results.length === 0) {
          setError(`No city found matching "${trimmed}".`)
          setWeather(null)
          setLoading(false)
          return
        }

        const place = geoData.results[0]
        const label = [place.name, place.admin1, place.country]
          .filter(Boolean)
          .join(', ')

        await fetchByCoords(place.latitude, place.longitude, label)
      } catch (err) {
        setError(err.message || 'Something went wrong fetching the weather.')
        setWeather(null)
        setLoading(false)
      }
    },
    [fetchByCoords]
  )

  return { weather, location, loading, error, fetchWeather, fetchByCoords }
}
