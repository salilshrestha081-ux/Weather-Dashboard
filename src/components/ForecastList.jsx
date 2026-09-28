import { describeWeatherCode } from '../utils/weatherCodes'

/**
 * Renders a short daily forecast strip.
 * Props:
 *  - daily: object from Open-Meteo's `daily` field (parallel arrays)
 *  - unit: 'celsius' | 'fahrenheit'
 */
export default function ForecastList({ daily, unit }) {
  if (!daily || !daily.time) return null

  function toDisplayTemp(celsius) {
    return unit === 'celsius'
      ? Math.round(celsius)
      : Math.round((celsius * 9) / 5 + 32)
  }

  function formatDay(dateStr) {
    return new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short' })
  }

  return (
    <div className="forecast-list">
      <h3>5-Day Forecast</h3>
      <div className="forecast-grid">
        {daily.time.map((date, index) => {
          const { icon, label } = describeWeatherCode(daily.weather_code[index])
          return (
            <div className="forecast-day" key={date}>
              <span className="forecast-date">{formatDay(date)}</span>
              <span className="forecast-icon" title={label}>{icon}</span>
              <span className="forecast-temps">
                <strong>{toDisplayTemp(daily.temperature_2m_max[index])}°</strong>
                {' / '}
                {toDisplayTemp(daily.temperature_2m_min[index])}°
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
