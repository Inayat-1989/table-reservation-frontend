import {
  formatSlotLabel,
  formatValue,
  getEntries,
  isPrimitive,
} from "../../utils/dashboardFormatters";
import EmptyState from "./EmptyState";

function getNumericValue(value, raw) {
  const candidate = isPrimitive(value)
    ? value
    : (raw?.count ??
      raw?.total ??
      raw?.value ??
      raw?.reservation_count ??
      raw?.selection_count ??
      0);
  const number = Number(candidate);
  return Number.isFinite(number) ? number : 0;
}

export default function SimpleBarList({
  data,
  emptyMessage = "No data available yet.",
}) {
  console.log(data);
  const entries = getEntries(data)
    .map(([label, value, raw]) => ({
      label:
        raw && typeof raw === "object" ? formatSlotLabel(raw) : String(label),
      value: getNumericValue(value, raw),
    }))
    .filter((item) => item.label && item.value >= 0)
    .slice(0, 8);

  if (!entries.length) return <EmptyState message={emptyMessage} />;

  const max = Math.max(...entries.map((item) => item.value), 1);

  return (
    <div className="dashboard-bar-list">
      {entries.map((item, index) => (
        <div className="dashboard-bar-item" key={`${item.label}-${index}`}>
          <div className="dashboard-bar-meta">
            <span title={item.label}>{item.label}</span>
            <strong>{formatValue(item.value)}</strong>
          </div>
          <div className="dashboard-bar-track">
            <div
              className="dashboard-bar-fill"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
