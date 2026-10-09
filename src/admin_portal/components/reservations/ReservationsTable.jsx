import { formatReservationDateTime, customerName, customerEmail, reservationSlot } from "../../utils/reservationFormatters";
import ReservationStatusBadge from "./ReservationStatusBadge";

export default function ReservationsTable({ reservations, onSelect, isLoading }) {
  if (isLoading) return <div className="reservation-table-message">Loading reservations…</div>;
  if (!reservations.length) return <div className="reservation-table-message">No reservations match your filters.</div>;

  return (
    <div className="reservations-table-wrap"><table className="reservations-table">
      <thead><tr><th>Reference</th><th>Customer</th><th>Reservation time</th><th>Guests</th><th>Status</th><th /></tr></thead>
      <tbody>{reservations.map((r, i) => <tr key={r.reference_code ?? i}>
        <td><strong className="reservation-reference">{r.reference_code ?? "—"}</strong></td>
        <td><div className="reservation-customer-cell"><strong>{customerName(r)}</strong><span>{customerEmail(r)}</span></div></td>
        <td>{formatReservationDateTime(reservationSlot(r))}</td>
        <td>{r.guest_count ?? "—"}</td><td><ReservationStatusBadge status={r.status} /></td>
        <td><button type="button" className="reservation-view-button" onClick={() => onSelect(r)}>View details</button></td>
      </tr>)}</tbody>
    </table></div>
  );
}
