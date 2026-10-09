import { getEntries } from "../../utils/dashboardFormatters";
import EmptyState from "./EmptyState";

export default function TrendingFoodList({ data }) {
  const items = getEntries(data)
    .map(([label, value, raw]) => ({
      label: String(raw?.title ?? raw?.name ?? raw?.menu_item_name ?? label),
      count: Number(raw?.selection_count ?? raw?.count ?? raw?.total ?? raw?.value ?? value),
    }))
    .filter((item) => Number.isFinite(item.count))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  if (!items.length) return <EmptyState message="No trending food items available yet." />;

  return (
    <div className="dashboard-food-list">
      {items.map((item, index) => (
        <div className="dashboard-food-item" key={`${item.label}-${index}`}>
          <span className="dashboard-food-rank">{String(index + 1).padStart(2, "0")}</span>
          <div className="dashboard-food-details">
            <strong>{item.label}</strong>
            <span>{item.count.toLocaleString()} selections</span>
          </div>
          <span className="dashboard-food-medal">{index === 0 ? "★" : "↗"}</span>
        </div>
      ))}
    </div>
  );
}
