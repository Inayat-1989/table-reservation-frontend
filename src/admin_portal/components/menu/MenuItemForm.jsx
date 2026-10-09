import { useEffect, useState } from "react";
import { formatPrice } from "../../utils/menuFormatters";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "",
  price: "",
  src: "",
  is_special: false,
  is_available: true,
};

export default function MenuItemForm({ item, categories, isSaving, onSubmit, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (!item) {
      setForm(EMPTY_FORM);
      setFormError("");
      return;
    }

    setForm({
      title: item.title ?? "",
      description: item.description ?? "",
      category: item.category?.id ?? item.category ?? "",
      price: item.price ?? "",
      src: item.src ?? "",
      is_special: Boolean(item.is_special),
      is_available: item.is_available !== false,
    });
    setFormError("");
  }, [item]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!form.title.trim()) {
      setFormError("Enter a title for this menu item.");
      return;
    }
    if (form.price === "" || !Number.isFinite(Number(form.price)) || Number(form.price) < 0) {
      setFormError("Enter a valid non-negative price.");
      return;
    }
    if (!form.category) {
      setFormError("Select a category.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: Number(form.category),
      price: Number(form.price),
      src: form.src.trim(),
      is_special: form.is_special,
      is_available: form.is_available,
    };

    try {
      await onSubmit(payload);
    } catch (error) {
      setFormError(error.message || "Could not save this menu item.");
    }
  }

  return (
    <div className="menu-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !isSaving) onClose();
    }}>
      <section className="menu-item-modal" role="dialog" aria-modal="true" aria-labelledby="menu-item-form-title">
        <header className="menu-modal-header">
          <div>
            <span className="dashboard-eyebrow">MENU MANAGEMENT</span>
            <h2 id="menu-item-form-title">{item ? "Edit menu item" : "Add menu item"}</h2>
          </div>
          <button type="button" className="menu-modal-close" aria-label="Close form" onClick={onClose} disabled={isSaving}>×</button>
        </header>

        <form className="menu-item-form" onSubmit={handleSubmit}>
          <label><span>Item title *</span>
            <input value={form.title} onChange={(event) => update("title", event.target.value)} maxLength={150} required />
          </label>

          <label><span>Category *</span>
            <select value={form.category} onChange={(event) => update("category", event.target.value)} required>
              <option value="">Select a category</option>
              {categories.filter((category) => category.is_active !== false).map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </label>

          <label><span>Price (PKR) *</span>
            <input type="number" min="0" step="0.01" value={form.price} onChange={(event) => update("price", event.target.value)} required />
          </label>

          <label><span>Image URL / path</span>
            <input value={form.src} onChange={(event) => update("src", event.target.value)} placeholder="/media/menu/item.jpg or https://…" />
          </label>

          <label className="menu-form-full"><span>Description</span>
            <textarea rows="3" value={form.description} onChange={(event) => update("description", event.target.value)} />
          </label>

          <div className="menu-form-toggles">
            <label className="menu-checkbox"><input type="checkbox" checked={form.is_special} onChange={(event) => update("is_special", event.target.checked)} /><span>Special item</span></label>
            <label className="menu-checkbox"><input type="checkbox" checked={form.is_available} onChange={(event) => update("is_available", event.target.checked)} /><span>Available to customers</span></label>
          </div>

          {formError && <p className="menu-form-error" role="alert">{formError}</p>}

          <footer className="menu-form-actions">
            <button type="button" className="menu-secondary-button" onClick={onClose} disabled={isSaving}>Cancel</button>
            <button type="submit" className="dashboard-button" disabled={isSaving}>
              {isSaving ? "Saving…" : item ? "Save changes" : "Create item"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
