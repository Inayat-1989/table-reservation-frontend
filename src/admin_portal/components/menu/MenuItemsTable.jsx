import { formatPrice } from "../../utils/menuFormatters";
import MenuItemStatus from "./MenuItemStatus";

export default function MenuItemsTable({ items, isLoading, onEdit, onDelete }) {
  if (isLoading) return <div className="menu-table-message">Loading menu items…</div>;
  if (!items.length) return <div className="menu-table-message">No menu items found.</div>;

  return (
    <div className="menu-table-wrap">
      <table className="menu-items-table">
        <thead><tr><th>Item</th><th>Category</th><th>Price</th><th>Special</th><th>Availability</th><th>Actions</th></tr></thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <div className="menu-item-name-cell">
                  {item.src ? <img src={item.src} alt="" loading="lazy" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} /> : <span className="menu-item-image-placeholder">🍽</span>}
                  <div><strong>{item.title}</strong><p>{item.description || "No description"}</p></div>
                </div>
              </td>
              <td>{item.category_name ?? item.category?.name ?? "—"}</td>
              <td className="menu-item-price">{formatPrice(item.price)}</td>
              <td><MenuItemStatus active={Boolean(item.is_special)} label={item.is_special ? "Special" : "Regular"} /></td>
              <td><MenuItemStatus active={Boolean(item.is_available) && !item.is_deleted} label={item.is_deleted ? "Deleted" : item.is_available ? "Available" : "Unavailable"} /></td>
              <td><div className="menu-item-actions">
                <button type="button" className="menu-action-button" onClick={() => onEdit(item)} disabled={item.is_deleted}>Edit</button>
                <button type="button" className="menu-action-button is-danger" onClick={() => onDelete(item)} disabled={item.is_deleted}>Delete</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
