import CategoryStatus from "./CategoryStatus";
import { formatCategoryDate } from "../../utils/menuCategoryFormatters";

export default function CategoriesTable({ categories, onEdit, onToggleStatus, onDelete, busyId }) {
  if (!categories.length) {
    return <div className="mc-empty-state"><div className="mc-empty-icon">☷</div><h3>No categories found</h3><p>Try changing your search or create a new menu category.</p></div>;
  }

  return (
    <div className="mc-table-wrap">
      <table className="mc-table">
        <thead><tr><th>Category</th><th>Description</th><th>Status</th><th>Created</th><th className="mc-actions-heading">Actions</th></tr></thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td><div className="mc-category-name"><span className="mc-category-avatar">{(category.name || "?").trim().charAt(0).toUpperCase()}</span><div><strong>{category.name || "Untitled category"}</strong><small>ID: {category.id}</small></div></div></td>
              <td><span className="mc-description" title={category.description || "No description"}>{category.description?.trim() || "No description added"}</span></td>
              <td><CategoryStatus active={Boolean(category.is_active)} /></td>
              <td className="mc-date">{formatCategoryDate(category.created_at)}</td>
              <td><div className="mc-row-actions">
                <button className="mc-action-button" type="button" onClick={() => onEdit(category)} disabled={busyId === category.id}>Edit</button>
                <button className="mc-action-button" type="button" onClick={() => onToggleStatus(category)} disabled={busyId === category.id}>{category.is_active ? "Deactivate" : "Activate"}</button>
                <button className="mc-action-button mc-action-danger" type="button" onClick={() => onDelete(category)} disabled={busyId === category.id}>Delete</button>
              </div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
