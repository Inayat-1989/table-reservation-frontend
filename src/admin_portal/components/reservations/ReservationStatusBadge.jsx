import { formatStatus } from "../../utils/reservationFormatters";

export default function ReservationStatusBadge({ status }) {
  const key = String(status ?? "unknown").toLowerCase();
  return <span className={`reservation-status-badge status-${key}`}>{formatStatus(status)}</span>;
}
