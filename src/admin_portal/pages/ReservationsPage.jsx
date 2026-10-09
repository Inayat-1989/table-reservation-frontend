import { useCallback, useEffect, useState } from "react";
import ReservationFilters from "../components/reservations/ReservationFilters";
import ReservationsTable from "../components/reservations/ReservationsTable";
import ReservationPagination from "../components/reservations/ReservationPagination";
import ReservationDetails from "../components/reservations/ReservationDetails";
import { getAdminReservation, getAdminReservations } from "../services/reservationService";

const EMPTY_FILTERS = { search: "", status: "", date_from: "", date_to: "" };
const EMPTY_LIST = { results: [], count: 0, next: null, previous: null };

function normalizeList(data) {
  if (Array.isArray(data)) return { results: data, count: data.length, next: null, previous: null };
  const results = data?.results ?? data?.reservations ?? [];
  return { results: Array.isArray(results) ? results : [], count: Number(data?.count ?? results.length), next: data?.next ?? null, previous: data?.previous ?? null };
}

export default function ReservationsPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [list, setList] = useState(EMPTY_LIST);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailsError, setDetailsError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAdminReservations({ ...appliedFilters, page, page_size: pageSize });
      setList(normalizeList(data));
    } catch (err) {
      setError(err.message || "Could not load reservations.");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, page, pageSize]);

  useEffect(() => { load(); }, [load]);

  function applyFilters() {
    if (filters.date_from && filters.date_to && filters.date_from > filters.date_to) {
      setError("The start date must be on or before the end date.");
      return;
    }
    setPage(1);
    setError("");
    setAppliedFilters({ ...filters });
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(1);
    setError("");
  }

  async function showDetails(row) {
    setSelected(row);
    setDetailsError("");
    try {
      const data = await getAdminReservation(row.reference_code);
      setSelected(data?.reservation ?? data?.data ?? data);
    } catch (err) {
      setDetailsError(err.message || "Could not load reservation details.");
    }
  }

  return <div className="admin-dashboard reservations-page">
    <header className="dashboard-page-heading"><div>
      <span className="dashboard-eyebrow">BOOKING MANAGEMENT</span><h1>Reservations</h1>
      <p>Search, filter, and review customer reservations.</p>
    </div><button className="dashboard-button" onClick={load} disabled={loading}>↻ Refresh</button></header>

    <section className="dashboard-panel reservations-filter-panel">
      <div className="dashboard-panel-heading"><div><h2>Find reservations</h2><p>Search customer details or filter by status and date.</p></div></div>
      <ReservationFilters filters={filters} onChange={setFilters} onApply={applyFilters} onReset={resetFilters} isLoading={loading} />
    </section>

    {error && <div className="reservations-error" role="alert"><span>{error}</span><button onClick={load}>Try again</button></div>}

    <section className="dashboard-panel reservations-results-panel">
      <div className="dashboard-panel-heading"><div><h2>All reservations</h2><p>{list.count.toLocaleString()} matching reservation(s)</p></div></div>
      <ReservationsTable reservations={list.results} onSelect={showDetails} isLoading={loading} />
      <ReservationPagination count={list.count} page={page} pageSize={pageSize}
        hasNext={Boolean(list.next)} hasPrevious={Boolean(list.previous)} isLoading={loading}
        onPageChange={setPage} onPageSizeChange={size => { setPageSize(size); setPage(1); }} />
    </section>

    {selected && <ReservationDetails reservation={selected} onClose={() => setSelected(null)} />}
    {detailsError && <div className="reservations-error" role="alert">{detailsError}<button onClick={() => setDetailsError("")}>Dismiss</button></div>}
  </div>;
}
