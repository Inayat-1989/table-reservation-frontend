export default function CategoryStatus({ active }) {
  return (
    <span className={`mc-status ${active ? "is-active" : "is-inactive"}`}>
      <span className="mc-status-dot" />
      {active ? "Active" : "Inactive"}
    </span>
  );
}
