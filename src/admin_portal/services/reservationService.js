import { apiRequest } from "../../api/client";

export function getAdminReservations(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, String(value).trim());
    }
  });
  const suffix = query.toString();
  return apiRequest(`/admin/reservations/${suffix ? `?${suffix}` : ""}`);
}

export function getAdminReservation(referenceCode) {
  return apiRequest(
    `/admin/reservations/${encodeURIComponent(referenceCode)}/`,
  );
}
