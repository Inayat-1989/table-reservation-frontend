import { apiRequest } from "../../api/client";

export function getDashboardSummary() {
  return apiRequest("/admin/dashboard/");
}

export function getReservationTrends(params = {}) {
  const query = new URLSearchParams(params);

  return apiRequest(`/admin/dashboard/trends/${query.size ? `?${query}` : ""}`);
}

export function getPeakHours() {
  return apiRequest("/admin/dashboard/peak-hours/");
}

export function getSlotPopularity() {
  return apiRequest("/admin/dashboard/slot-popularity/");
}

export function getTrendingFoodItems() {
  return apiRequest("/admin/dashboard/trending-food-items/");
}
