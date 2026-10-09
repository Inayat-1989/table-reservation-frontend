export default function EmptyState({ message }) {
  return (
    <div className="dashboard-empty">
      <span aria-hidden="true">◌</span>
      <p>{message}</p>
    </div>
  );
}
