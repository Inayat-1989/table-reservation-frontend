export default function MenuItemFilters({ search, availability, onSearchChange, onAvailabilityChange }) {
  return (
    <div className="menu-filters">
      <label className="menu-search-field">
        <span>Search menu items</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search by title or description"
        />
      </label>
      <label>
        <span>Availability</span>
        <select value={availability} onChange={(event) => onAvailabilityChange(event.target.value)}>
          <option value="all">All items</option>
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="special">Special items</option>
        </select>
      </label>
    </div>
  );
}
