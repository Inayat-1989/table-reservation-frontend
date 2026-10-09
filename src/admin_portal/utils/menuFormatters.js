export function formatPrice(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return value ?? "—";

  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function normalizeList(response, fallbackKey) {
  if (Array.isArray(response)) return response;
  const list = response?.results ?? response?.[fallbackKey] ?? [];
  return Array.isArray(list) ? list : [];
}
