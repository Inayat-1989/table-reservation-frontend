import { formatReservationDateTime, customerName, customerEmail, customerPhone, reservationSlot } from "../../utils/reservationFormatters";
import ReservationStatusBadge from "./ReservationStatusBadge";

function Field({ label, children }) {
  return <div className="reservation-detail"><span>{label}</span><strong>{children ?? "—"}</strong></div>;
}

export default function ReservationDetails({ reservation, onClose }) {
  if (!reservation) return null;
  const items = Array.isArray(reservation.selected_menu_items) ? reservation.selected_menu_items : [];
  return <div className="reservation-modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <section className="reservation-details-modal" role="dialog" aria-modal="true" aria-labelledby="reservation-detail-title">
      <header className="reservation-details-header"><div><span className="dashboard-eyebrow">RESERVATION DETAILS</span>
        <h2 id="reservation-detail-title">{reservation.reference_code}</h2></div>
        <button className="reservation-modal-close" aria-label="Close" onClick={onClose}>×</button>
      </header>
      <div className="reservation-details-status"><span>Status</span><ReservationStatusBadge status={reservation.status} /></div>
      <div className="reservation-details-grid">
        <Field label="Customer">{customerName(reservation)}</Field><Field label="Email">{customerEmail(reservation)}</Field>
        <Field label="Phone">{customerPhone(reservation)}</Field><Field label="Guests">{reservation.guest_count}</Field>
        <Field label="Reservation time">{formatReservationDateTime(reservationSlot(reservation))}</Field>
        <Field label="Created">{formatReservationDateTime(reservation.created_at)}</Field>
        <Field label="Special menu eligible">{reservation.special_menu_eligible == null ? "—" : reservation.special_menu_eligible ? "Yes" : "No"}</Field>
        <Field label="Expires">{formatReservationDateTime(reservation.expires_at)}</Field>
      </div>
      <div className="reservation-detail-block"><h3>Customer note</h3><p>{reservation.customer_note || "No note provided."}</p></div>
      <div className="reservation-detail-block"><h3>Selected menu items</h3>
        {items.length ? <ul>{items.map((item, i) => <li key={i}>{typeof item === "object" ? item.title ?? item.name ?? JSON.stringify(item) : String(item)}</li>)}</ul> : <p>No selected menu items.</p>}
      </div>
      <footer className="reservation-details-footer"><span>Updated: {formatReservationDateTime(reservation.updated_at)}</span>
        <button type="button" className="dashboard-button" onClick={onClose}>Close</button></footer>
    </section>
  </div>;
}
