export default function MenuPagination({ count, page, pageSize, hasNext, hasPrevious, onPageChange, onPageSizeChange, disabled }) {
  const first = count ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(page * pageSize, count);
  return <div className="menu-pagination">
    <p>Showing <strong>{first}–{last}</strong> of <strong>{count}</strong> items</p>
    <div className="menu-pagination-controls">
      <label>Rows <select value={pageSize} disabled={disabled} onChange={event => onPageSizeChange(Number(event.target.value))}>
        {[10, 20, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
      </select></label>
      <button type="button" className="menu-secondary-button" disabled={disabled || !hasPrevious} onClick={() => onPageChange(page - 1)}>Previous</button>
      <span>Page {page} of {Math.max(1, Math.ceil(count / pageSize))}</span>
      <button type="button" className="menu-secondary-button" disabled={disabled || !hasNext} onClick={() => onPageChange(page + 1)}>Next</button>
    </div>
  </div>;
}
