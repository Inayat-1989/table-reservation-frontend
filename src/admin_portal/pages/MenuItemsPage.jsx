import { useCallback, useEffect, useMemo, useState } from "react";
import MenuItemFilters from "../components/menu/MenuItemFilters";
import MenuItemForm from "../components/menu/MenuItemForm";
import MenuItemsTable from "../components/menu/MenuItemsTable";
import MenuPagination from "../components/menu/MenuPagination";
import {
  createMenuItem,
  deleteMenuItem,
  getMenuCategories,
  getMenuItems,
  updateMenuItem,
} from "../services/menuService";
import { normalizeList } from "../utils/menuFormatters";
import "../styles/menu-items.css";

function getPageList(response) {
  const results = normalizeList(response, "items");
  return {
    results,
    count: Number(response?.count ?? results.length),
    next: response?.next ?? null,
    previous: response?.previous ?? null,
  };
}

export default function MenuItemsPage() {
  const [itemsData, setItemsData] = useState({
    results: [],
    count: 0,
    next: null,
    previous: null,
  });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formItem, setFormItem] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [searchApplied, setSearchApplied] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [itemsResponse, categoriesResponse] = await Promise.all([
        getMenuItems({ search: searchApplied, page, page_size: pageSize }),
        // eslint-disable-next-line react-hooks/immutability
        getMenuCategoriesForPage(),
      ]);
      const nextData = getPageList(itemsResponse);
      setItemsData(nextData);
      setCategories(normalizeList(categoriesResponse, "categories"));
    } catch (requestError) {
      setError(requestError.message || "Could not load menu items.");
    } finally {
      setLoading(false);
    }
  }, [searchApplied, page, pageSize]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  async function getMenuCategoriesForPage() {
    return getMenuCategories();
  }

  const visibleItems = useMemo(() => {
    switch (availability) {
      case "available":
        return itemsData.results.filter(
          (item) => item.is_available && !item.is_deleted,
        );
      case "unavailable":
        return itemsData.results.filter(
          (item) => !item.is_available && !item.is_deleted,
        );
      case "special":
        return itemsData.results.filter(
          (item) => item.is_special && !item.is_deleted,
        );
      default:
        return itemsData.results;
    }
  }, [itemsData.results, availability]);

  function applySearch(event) {
    event?.preventDefault();
    setPage(1);
    setSearchApplied(search.trim());
  }

  async function saveItem(payload) {
    setSaving(true);
    setError("");
    try {
      if (formItem?.id) {
        await updateMenuItem(formItem.id, payload);
        setNotice("Menu item updated successfully.");
      } else {
        await createMenuItem(payload);
        setNotice("Menu item created successfully.");
      }
      setFormOpen(false);
      setFormItem(null);
      await loadData();
      // eslint-disable-next-line no-useless-catch
    } catch (requestError) {
      throw requestError;
    } finally {
      setSaving(false);
    }
  }

  async function removeItem(item) {
    const confirmed = window.confirm(
      `Soft-delete "${item.title}"? It will no longer be available to customers.`,
    );
    if (!confirmed) return;

    setError("");
    setNotice("");
    try {
      await deleteMenuItem(item.id);
      setNotice(`"${item.title}" was deleted.`);
      await loadData();
    } catch (requestError) {
      setError(requestError.message || "Could not delete this menu item.");
    }
  }

  function openCreate() {
    setFormItem(null);
    setFormOpen(true);
  }

  function openEdit(item) {
    setFormItem(item);
    setFormOpen(true);
  }

  return (
    <div className="admin-dashboard menu-items-page">
      <header className="dashboard-page-heading">
        <div>
          <span className="dashboard-eyebrow">MENU MANAGEMENT</span>
          <h1>Menu Items</h1>
          <p>Create and maintain the dishes shown on your restaurant menu.</p>
        </div>
        <button type="button" className="dashboard-button" onClick={openCreate}>
          ＋ Add menu item
        </button>
      </header>

      {error && (
        <div className="menu-feedback is-error" role="alert">
          <span>{error}</span>
          <button onClick={loadData}>Retry</button>
        </div>
      )}
      {notice && (
        <div className="menu-feedback is-success" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Dismiss notice">
            ×
          </button>
        </div>
      )}

      <section className="dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <h2>Menu catalogue</h2>
            <p>
              Search and filter items, then edit their details or availability.
            </p>
          </div>
        </div>
        <form className="menu-toolbar" onSubmit={applySearch}>
          <MenuItemFilters
            search={search}
            availability={availability}
            onSearchChange={setSearch}
            onAvailabilityChange={setAvailability}
          />
          <button className="dashboard-button" type="submit">
            Search
          </button>
        </form>
        <MenuItemsTable
          items={visibleItems}
          isLoading={loading}
          onEdit={openEdit}
          onDelete={removeItem}
        />
        <MenuPagination
          count={itemsData.count}
          page={page}
          pageSize={pageSize}
          hasNext={Boolean(itemsData.next)}
          hasPrevious={Boolean(itemsData.previous)}
          disabled={loading}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </section>

      {formOpen && (
        <MenuItemForm
          item={formItem}
          categories={categories}
          isSaving={saving}
          onSubmit={saveItem}
          onClose={() => {
            if (!saving) {
              setFormOpen(false);
              setFormItem(null);
            }
          }}
        />
      )}
    </div>
  );
}
