export default function CategoryFilters({ search, onSearchChange, status, onStatusChange, onCreate }) {
  return (
    <div className="mc-toolbar">
      <label className="mc-search">
        <span className="mc-search-icon" aria-hidden="true">⌕</span>
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search categories..."
          aria-label="Search categories"
        />
      </label>
      <select value={status} onChange={(event) => onStatusChange(event.target.value)} aria-label="Filter by status">
        <option value="all">All statuses</option>
        <option value="active">Active only</option>
        <option value="inactive">Inactive only</option>
      </select>
      <button className="mc-button mc-button-primary" type="button" onClick={onCreate}>
        <span aria-hidden="true">＋</span> Add category
      </button>
    </div>
  );
}
