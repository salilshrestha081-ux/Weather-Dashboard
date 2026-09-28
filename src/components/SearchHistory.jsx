/**
 * Shows the last few searched cities as clickable chips.
 * Props:
 *  - history: array of city name strings, most recent first
 *  - onSelect(city): callback fired when a past search is clicked
 *  - onClear(): callback to clear the whole history
 */
export default function SearchHistory({ history, onSelect, onClear }) {
  if (history.length === 0) return null

  return (
    <div className="search-history">
      <div className="search-history-header">
        <span>Recent searches</span>
        <button className="clear-btn" onClick={onClear}>
          Clear
        </button>
      </div>
      <ul>
        {history.map((city, index) => (
          <li key={`${city}-${index}`}>
            <button onClick={() => onSelect(city)}>{city}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
