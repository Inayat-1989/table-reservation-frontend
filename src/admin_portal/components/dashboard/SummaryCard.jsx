import { formatValue, SUMMARY_ICONS } from "../../utils/dashboardFormatters";

const FALLBACK_ICONS = ["▦", "↗", "◷", "♧"];

export default function SummaryCard({ item, index }) {
  const icon = SUMMARY_ICONS[item.key.toLowerCase()] ?? FALLBACK_ICONS[index % 4];

  return (
    <article className={`dashboard-stat-card stat-accent-${index % 4}`}>
      <div className="dashboard-stat-top">
        <span className="dashboard-stat-icon" aria-hidden="true">{icon}</span>
        <span className="dashboard-stat-indicator" />
      </div>
      <p className="dashboard-stat-label">{item.label}</p>
      <strong className="dashboard-stat-value">{formatValue(item.value)}</strong>
    </article>
  );
}
