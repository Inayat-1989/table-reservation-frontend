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

export function getMenuItems(params = {}) {
  return apiRequest(`/admin/menu/items/${buildQuery(params)}`);
}

export function getMenuItem(id) {
  return apiRequest(`/admin/menu/items/${encodeURIComponent(id)}/`);
}

export function createMenuItem(payload) {
  return apiRequest("/admin/menu/items/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateMenuItem(id, payload) {
  return apiRequest(`/admin/menu/items/${encodeURIComponent(id)}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteMenuItem(id) {
  return apiRequest(`/admin/menu/items/${encodeURIComponent(id)}/`, {
    method: "DELETE",
  });
}

export function getMenuCategories(params = {}) {
  return apiRequest(`/admin/menu/categories/${buildQuery(params)}`);
}
