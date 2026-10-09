export default function ReservationPagination({ count, page, pageSize, hasNext, hasPrevious, onPageChange, onPageSizeChange, isLoading }) {
  const first = count ? (page - 1) * pageSize + 1 : 0;
  const last = Math.min(page * pageSize, count);
  return <div className="reservation-pagination">
    <p>Showing <strong>{first}–{last}</strong> of <strong>{count}</strong></p>
    <div className="reservation-pagination-controls">
      <label>Rows <select value={pageSize} disabled={isLoading} onChange={e => onPageSizeChange(Number(e.target.value))}>
        {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
      </select></label>
      <button className="reservation-page-button" disabled={isLoading || !hasPrevious} onClick={() => onPageChange(page - 1)}>Previous</button>
      <span>Page {page} of {Math.max(1, Math.ceil(count / pageSize))}</span>
      <button className="reservation-page-button" disabled={isLoading || !hasNext} onClick={() => onPageChange(page + 1)}>Next</button>
    </div>
  </div>;
}
