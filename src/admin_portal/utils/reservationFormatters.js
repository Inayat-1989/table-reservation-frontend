const TIME_ZONE = "Asia/Karachi";

export function formatReservationDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-PK", {
    timeZone: TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function formatStatus(value) {
  return value
    ? String(value)
        .replace(/[_-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Unknown";
}

export const customerName = (r) =>
  r?.customer_name ?? r?.customer?.full_name ?? "Unknown customer";
export const customerEmail = (r) =>
  r?.customer_email ?? r?.customer?.email ?? "—";
export const customerPhone = (r) =>
  r?.customer_phone ?? r?.customer?.phone ?? "—";
export const reservationSlot = (r) =>
  r?.slot_start ?? r?.starts_at ?? r?.slot?.starts_at;
