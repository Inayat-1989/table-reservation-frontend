import { apiRequest } from "../../api/client";

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, String(value).trim());
    }
  });
  const text = query.toString();
  return text ? `?${text}` : "";
}

export function getMenuCategories(params = {}) {
  return apiRequest(`/admin/menu/categories/${buildQuery(params)}`);
}

export function createMenuCategory(payload) {
  return apiRequest("/admin/menu/categories/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateMenuCategory(id, payload) {
  return apiRequest(`/admin/menu/categories/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteMenuCategory(id) {
  return apiRequest(`/admin/menu/categories/${encodeURIComponent(id)}/`, {
    method: "DELETE",
  });
}
