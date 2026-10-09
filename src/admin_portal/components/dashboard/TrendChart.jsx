import { getEntries, isPrimitive } from "../../utils/dashboardFormatters";
import EmptyState from "./EmptyState";

export default function TrendChart({ data }) {
  const entries = getEntries(data)
    .map(([label, value, raw]) => ({
      label: String(label),
      value: Number(
        isPrimitive(value)
          ? value
          : raw?.count ?? raw?.total ?? raw?.value ?? raw?.reservation_count ?? raw?.reservations,
      ),
    }))
    .filter((item) => Number.isFinite(item.value))
    .slice(-12);

  if (!entries.length) {
    return <EmptyState message="Reservation trend data is not available in a chartable format." />;
  }

  const width = 640;
  const height = 220;
  const padding = { top: 18, right: 16, bottom: 34, left: 34 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...entries.map((item) => item.value), 1);
  const baseline = padding.top + chartHeight;

  const points = entries.map((item, index) => {
    const x = padding.left + (entries.length === 1 ? chartWidth / 2 : (index / (entries.length - 1)) * chartWidth);
    const y = baseline - (item.value / maxValue) * chartHeight;
    return { ...item, x, y };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${baseline} L ${points[0].x} ${baseline} Z`;

  return (
    <div className="dashboard-trend-chart">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Reservation trend chart" preserveAspectRatio="xMidYMid meet">
        {[0, 0.5, 1].map((fraction) => {
          const y = padding.top + chartHeight * fraction;
          return (
            <g key={fraction}>
              <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} className="dashboard-chart-grid" />
              <text x={padding.left - 8} y={y + 4} textAnchor="end" className="dashboard-chart-axis">
                {Math.round(maxValue * (1 - fraction))}
              </text>
            </g>
          );
        })}
        <path d={areaPath} className="dashboard-chart-area" />
        <path d={linePath} className="dashboard-chart-line" />
        {points.map((point, index) => (
          <g key={`${point.label}-${index}`}>
            <circle cx={point.x} cy={point.y} r="4" className="dashboard-chart-point">
              <title>{point.label}: {point.value}</title>
            </circle>
            {(entries.length <= 6 || index === 0 || index === entries.length - 1 || index === Math.floor(entries.length / 2)) && (
              <text x={point.x} y={height - 10} textAnchor="middle" className="dashboard-chart-axis">
                {point.label.length > 10 ? `${point.label.slice(0, 10)}…` : point.label}
              </text>
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
