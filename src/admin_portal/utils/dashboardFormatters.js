const RESTAURANT_TIMEZONE = "Asia/Karachi";

export function formatPakistanDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return new Intl.DateTimeFormat("en-PK", {
    timeZone: RESTAURANT_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function formatLocalTime(hour, minute = 0) {
  const parsedHour = Number(hour);
  const parsedMinute = Number(minute);

  if (
    !Number.isInteger(parsedHour) || parsedHour < 0 || parsedHour > 23 ||
    !Number.isInteger(parsedMinute) || parsedMinute < 0 || parsedMinute > 59
  ) {
    return "Unknown time";
  }

  const date = new Date(2000, 0, 1, parsedHour, parsedMinute);
  return new Intl.DateTimeFormat("en-PK", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function formatSlotLabel(item) {
  const timestamp = item?.starts_at ?? item?.slot_start ?? item?.start_time;

  if (timestamp && !/^\d{1,2}(:\d{2})?$/.test(String(timestamp))) {
    return formatPakistanDateTime(timestamp);
  }

  // Aggregated hour/minute fields are already extracted in Asia/Karachi by Django.
  if (item?.hour != null) {
    return formatLocalTime(item.hour, item.minute ?? 0);
  }

  const rawTime = timestamp ?? item?.time;
  if (rawTime == null) return "Unknown time";

  const match = String(rawTime).match(/^(\d{1,2})(?::(\d{2}))?/);
  if (!match) return String(rawTime);

  return formatLocalTime(match[1], match[2] ?? 0);
}

export function formatLabel(value) {
  return String(value)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export function formatValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export function isPrimitive(value) {
  return value === null || ["string", "number", "boolean"].includes(typeof value);
}

export function getEntries(data) {
  if (Array.isArray(data)) {
    return data.map((item, index) => {
      if (isPrimitive(item)) return [`Item ${index + 1}`, item];

      const label =
        item.title ?? item.name ?? item.label ?? item.date ?? item.day ??
        item.hour ?? item.time ?? `Item ${index + 1}`;

      const value =
        item.count ?? item.total ?? item.value ?? item.reservations ??
        item.selection_count ?? item.guest_count ?? item.reservation_count;

      return [label, value ?? item, item];
    });
  }

  if (data && typeof data === "object") {
    return Object.entries(data).map(([key, value]) => [key, value, value]);
  }

  return [];
}

const SUMMARY_LABELS = {
  today_reservations: "Today's Reservations",
  todays_reservations: "Today's Reservations",
  upcoming_reservations: "Upcoming Reservations",
  guests_expected_this_week: "Guests This Week",
  total_reservations: "Total Reservations",
  confirmed_reservations: "Confirmed Reservations",
  pending_reservations: "Pending Reservations",
  total_guests: "Total Guests",
};

export const SUMMARY_ICONS = {
  today_reservations: "▦",
  todays_reservations: "▦",
  upcoming_reservations: "↗",
  guests_expected_this_week: "♙",
  total_reservations: "▤",
  confirmed_reservations: "✓",
  pending_reservations: "◷",
  total_guests: "♧",
};

export function getSummaryCards(summary) {
  const entries = getEntries(summary);
  const preferredKeys = [
    "today_reservations",
    "todays_reservations",
    "upcoming_reservations",
    "guests_expected_this_week",
  ];

  const normalized = entries.map(([key, value, raw]) => ({
    key: String(key), value, raw,
  }));

  const preferred = preferredKeys
    .map((key) => normalized.find((item) => item.key.toLowerCase() === key))
    .filter(Boolean);

  const cards = preferred.length
    ? preferred
    : normalized.filter((item) => isPrimitive(item.value));

  return cards.slice(0, 4).map((item) => ({
    ...item,
    label: SUMMARY_LABELS[item.key.toLowerCase()] ?? formatLabel(item.key),
  }));
}
