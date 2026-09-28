/**
 * Renders loading / error / empty-state messaging.
 * Props:
 *  - type: 'loading' | 'error' | 'empty'
 *  - message: string, only used for the 'error' type
 */
export default function StatusMessage({ type, message }) {
  if (type === 'loading') {
    return (
      <div className="status-message status-loading" role="status">
        <div className="spinner" aria-hidden="true" />
        <p>Loading weather data…</p>
      </div>
    )
  }

  if (type === 'error') {
    return (
      <div className="status-message status-error" role="alert">
        <p>⚠️ {message}</p>
      </div>
    )
  }

  // empty state
  return (
    <div className="status-message status-empty">
      <p>🔍 Search for a city above to see the current weather.</p>
    </div>
  )
}
