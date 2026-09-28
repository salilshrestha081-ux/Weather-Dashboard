import { describeWeatherCode } from '../utils/weatherCodes'

/**
 * Displays current conditions for the searched location.
 * Props:
 *  - location: string label ("Kathmandu, Bagmati, Nepal")
 *  - current: object from Open-Meteo's `current` field
 *  - unit: 'celsius' | 'fahrenheit'
 *  - onToggleUnit(): callback to flip the temperature unit
 */
export default function WeatherCard({ location, current, unit, onToggleUnit }) {
  const { label, icon } = describeWeatherCode(current.weather_code)

  const displayTemp =
    unit === 'celsius'
      ? Math.round(current.temperature_2m)
      : Math.round(current.temperature_2m * 9 / 5 + 32)

  return (
    <div className="weather-card">
      <div className="weather-card-header">
        <h2>{location}</h2>
       <button
  className="unit-toggle"
  onClick={onToggleUnit}
  aria-label={`Switch temperature to ${
    unit === 'celsius' ? 'Fahrenheit' : 'Celsius'
  }`}
>
          °{unit === 'celsius' ? 'C' : 'F'} ⇄ °{unit === 'celsius' ? 'F' : 'C'}
        </button>
      </div>

      <div className="weather-card-main">
        <span className="weather-icon" aria-hidden="true">{icon}</span>
        <span className="weather-temp">
          {displayTemp}°{unit === 'celsius' ? 'C' : 'F'}
        </span>
      </div>

      <p className="weather-condition">{label}</p>

      <div className="weather-details">
        <div>
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{current.relative_humidity_2m}%</span>
        </div>
        <div>
          <span className="detail-label">Wind</span>
          <span className="detail-value">{Math.round(current.wind_speed_10m)} km/h</span>
        </div>
      </div>
    </div>
  )
}
