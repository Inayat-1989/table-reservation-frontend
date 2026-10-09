const STATUSES = [
  ["", "All statuses"], ["DRAFT", "Draft"],
  ["PENDING_VERIFICATION", "Pending verification"], ["CONFIRMED", "Confirmed"],
  ["CANCELLED", "Cancelled"], ["COMPLETED", "Completed"], ["EXPIRED", "Expired"],
];

export default function ReservationFilters({ filters, onChange, onApply, onReset, isLoading }) {
  const update = (key, value) => onChange(current => ({ ...current, [key]: value }));
  return (
    <form className="reservation-filters" onSubmit={e => { e.preventDefault(); onApply(); }}>
      <label className="reservation-filter-search"><span>Search</span>
        <input type="search" value={filters.search} onChange={e => update("search", e.target.value)}
          placeholder="Name, email, phone, or reference" />
      </label>
      <label><span>Status</span><select value={filters.status} onChange={e => update("status", e.target.value)}>
        {STATUSES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select></label>
      <label><span>From date</span><input type="date" value={filters.date_from} onChange={e => update("date_from", e.target.value)} /></label>
      <label><span>To date</span><input type="date" value={filters.date_to} onChange={e => update("date_to", e.target.value)} /></label>
      <div className="reservation-filter-actions">
        <button className="dashboard-button" type="submit" disabled={isLoading}>Apply filters</button>
        <button className="reservation-reset-button" type="button" onClick={onReset} disabled={isLoading}>Reset</button>
      </div>
    </form>
  );
}
