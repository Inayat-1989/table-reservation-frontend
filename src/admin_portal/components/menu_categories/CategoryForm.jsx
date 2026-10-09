import { useEffect, useState } from "react";

const EMPTY_FORM = { name: "", description: "", is_active: true };

export default function CategoryForm({ category, saving, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    setForm(category ? {
      name: category.name ?? "",
      description: category.description ?? "",
      is_active: category.is_active ?? true,
    } : EMPTY_FORM);
    setValidationError("");
  }, [category]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const name = form.name.trim();
    if (!name) {
      setValidationError("Category name is required.");
      return;
    }
    if (name.length > 100) {
      setValidationError("Category name must be 100 characters or fewer.");
      return;
    }
    setValidationError("");
    onSubmit({ name, description: form.description.trim(), is_active: form.is_active });
  }

  return (
    <div className="mc-modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget && !saving) onClose();
    }}>
      <section className="mc-modal" role="dialog" aria-modal="true" aria-labelledby="mc-form-title">
        <header className="mc-modal-header">
          <div>
            <p className="mc-eyebrow">MENU MANAGEMENT</p>
            <h2 id="mc-form-title">{category ? "Edit category" : "Create category"}</h2>
            <p className="mc-modal-subtitle">Organize menu items into clear sections.</p>
          </div>
          <button className="mc-icon-button" type="button" onClick={onClose} disabled={saving} aria-label="Close">×</button>
        </header>
        <form onSubmit={submit}>
          <div className="mc-form-body">
            {validationError && <div className="mc-alert mc-alert-error" role="alert">{validationError}</div>}
            <label className="mc-field">
              <span>Category name <b>*</b></span>
              <input autoFocus maxLength={100} value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="e.g. Main Course" required />
            </label>
            <label className="mc-field">
              <span>Description <small>Optional</small></span>
              <textarea rows={4} value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Briefly describe this menu category" />
            </label>
            <label className="mc-toggle-field">
              <span className="mc-toggle-copy"><strong>Category is active</strong><small>Active categories can be offered when creating or editing menu items.</small></span>
              <input type="checkbox" checked={Boolean(form.is_active)} onChange={(event) => update("is_active", event.target.checked)} />
            </label>
          </div>
          <footer className="mc-modal-footer">
            <button className="mc-button mc-button-quiet" type="button" onClick={onClose} disabled={saving}>Cancel</button>
            <button className="mc-button mc-button-primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : category ? "Save changes" : "Create category"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}
