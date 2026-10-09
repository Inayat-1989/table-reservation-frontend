import useAdminDashboard from "../hooks/useAdminDashboard";
import SectionCard from "../components/dashboard/SectionCard";
import SimpleBarList from "../components/dashboard/SimpleBarList";
import SummaryCards from "../components/dashboard/SummaryCards";
import TrendChart from "../components/dashboard/TrendChart";
import TrendingFoodList from "../components/dashboard/TrendingFoodList";
import {
  DashboardError,
  DashboardLoading,
} from "../components/dashboard/DashboardStatus";

export default function DashboardPage() {
  const {
    summary,
    trends,
    peakHours,
    slotPopularity,
    trendingFoodItems,
    isLoading,
    error,
    refresh,
  } = useAdminDashboard();

  if (isLoading) return <DashboardLoading />;
  if (error) return <DashboardError message={error} onRetry={refresh} />;

  return (
    <div className="admin-dashboard">
      <header className="dashboard-page-heading">
        <div>
          <span className="dashboard-eyebrow">RESTAURANT OVERVIEW</span>
          <h1>Dashboard</h1>
          <p>Here’s how your restaurant is performing.</p>
        </div>
        <button type="button" className="dashboard-button" onClick={refresh}>
          <span className="dashboard-refresh-icon" aria-hidden="true">
            ↻
          </span>
          Refresh data
        </button>
      </header>

      <SummaryCards summary={summary} />

      <div className="dashboard-main-grid">
        <SectionCard
          title="Reservation Trends"
          subtitle="Reservation activity over time"
          className="dashboard-trends-panel"
        >
          <TrendChart data={trends} />
        </SectionCard>

        <SectionCard
          title="Trending Food Items"
          subtitle="Most selected special menu items"
        >
          <TrendingFoodList data={trendingFoodItems} />
        </SectionCard>

        <SectionCard title="Peak Hours" subtitle="Reservation activity by hour">
          <SimpleBarList data={peakHours} />
        </SectionCard>

        <SectionCard
          title="Popular Time Slots"
          subtitle="Most popular reservation slots"
        >
          <SimpleBarList data={slotPopularity} />
        </SectionCard>
      </div>
    </div>
  );
}
