export default function MenuItemStatus({ active, label }) {
  return (
    <span className={`menu-item-status ${active ? "is-active" : "is-inactive"}`}>
      {label ?? (active ? "Active" : "Inactive")}
    </span>
  );
}
