export function DashboardLoading() {
  return (
    <div className="dashboard-loading">
      <span className="dashboard-spinner" />
      <p>Preparing your restaurant dashboard...</p>
    </div>
  );
}

export function DashboardError({ message, onRetry }) {
  return (
    <div className="dashboard-error">
      <div>
        <h1>Dashboard unavailable</h1>
        <p>{message}</p>
      </div>
      <button type="button" className="dashboard-button" onClick={onRetry}>
        <span aria-hidden="true">↻</span>
        Retry loading
      </button>
    </div>
  );
}
