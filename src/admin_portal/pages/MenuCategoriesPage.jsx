import { useCallback, useEffect, useMemo, useState } from "react";
import CategoryFilters from "../components/menu_categories/CategoryFilters";
import CategoryForm from "../components/menu_categories/CategoryForm";
import CategoriesTable from "../components/menu_categories/CategoriesTable";
import { createMenuCategory, deleteMenuCategory, getMenuCategories, updateMenuCategory } from "../services/menuCategoryService";
import { normalizeCategories } from "../utils/menuCategoryFormatters";
import "../styles/menu-categories.css";

export default function MenuCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getMenuCategories();
      setCategories(normalizeCategories(response));
    } catch (err) {
      setError(err.message || "Could not load menu categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadCategories(); }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    return categories.filter((category) => {
      const matchesSearch = !query || [category.name, category.description, String(category.id ?? "")]
        .some((value) => String(value ?? "").toLocaleLowerCase().includes(query));
      const matchesStatus = status === "all" || (status === "active" ? Boolean(category.is_active) : !category.is_active);
      return matchesSearch && matchesStatus;
    }).sort((a, b) => String(a.name ?? "").localeCompare(String(b.name ?? "")));
  }, [categories, search, status]);

  function openCreateForm() { setEditingCategory(null); setFormOpen(true); }
  function openEditForm(category) { setEditingCategory(category); setFormOpen(true); }
  function closeForm() { if (!saving) { setFormOpen(false); setEditingCategory(null); } }

  async function saveCategory(payload) {
    setSaving(true); setError(""); setNotice("");
    try {
      if (editingCategory) {
        await updateMenuCategory(editingCategory.id, payload);
        setNotice("Category updated successfully.");
      } else {
        await createMenuCategory(payload);
        setNotice("Category created successfully.");
      }
      setFormOpen(false); setEditingCategory(null);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Could not save this category.");
    } finally { setSaving(false); }
  }

  async function toggleStatus(category) {
    const nextActive = !category.is_active;
    const action = nextActive ? "activate" : "deactivate";
    if (!window.confirm(`Are you sure you want to ${action} “${category.name}”?`)) return;
    setBusyId(category.id); setError(""); setNotice("");
    try {
      await updateMenuCategory(category.id, { is_active: nextActive });
      setNotice(`“${category.name}” is now ${nextActive ? "active" : "inactive"}.`);
      await loadCategories();
    } catch (err) { setError(err.message || `Could not ${action} this category.`); }
    finally { setBusyId(null); }
  }

  async function removeCategory(category) {
    const confirmed = window.confirm(
      `Delete “${category.name}”? This may be rejected if menu items still reference this category. This action cannot be undone from this screen.`
    );
    if (!confirmed) return;
    setBusyId(category.id); setError(""); setNotice("");
    try {
      await deleteMenuCategory(category.id);
      setNotice(`“${category.name}” was deleted.`);
      await loadCategories();
    } catch (err) {
      setError(err.message || "Could not delete this category. If it contains menu items, move those items to another category first.");
    } finally { setBusyId(null); }
  }

  return (
    <div className="mc-page">
      <header className="mc-page-header">
        <div><p className="mc-eyebrow">MENU MANAGEMENT</p><h1>Menu Categories</h1><p className="mc-page-subtitle">Create and maintain the sections used to organize your restaurant menu.</p></div>
        <div className="mc-header-stat"><span className="mc-header-stat-icon">☷</span><div><strong>{categories.length}</strong><span>Total categories</span></div></div>
      </header>

      <section className="mc-panel">
        <div className="mc-panel-heading"><div><h2>All categories</h2><p>Manage names, descriptions, and availability.</p></div><span className="mc-count-pill">{filteredCategories.length} shown</span></div>
        <CategoryFilters search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} onCreate={openCreateForm} />
        {notice && <div className="mc-alert mc-alert-success" role="status"><span>✓</span>{notice}<button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification">×</button></div>}
        {error && <div className="mc-alert mc-alert-error" role="alert"><span>!</span>{error}<button type="button" onClick={() => setError("")} aria-label="Dismiss error">×</button></div>}
        {loading ? <div className="mc-loading"><span className="mc-spinner" />Loading categories…</div> : <CategoriesTable categories={filteredCategories} onEdit={openEditForm} onToggleStatus={toggleStatus} onDelete={removeCategory} busyId={busyId} />}
        {!loading && filteredCategories.length > 0 && <footer className="mc-table-footer">Showing <strong>{filteredCategories.length}</strong> of <strong>{categories.length}</strong> categories</footer>}
      </section>

      {formOpen && <CategoryForm category={editingCategory} saving={saving} onClose={closeForm} onSubmit={saveCategory} />}
    </div>
  );
}
