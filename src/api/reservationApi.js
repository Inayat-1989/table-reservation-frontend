import { apiRequest } from "./client";

export function getReservations() {
    return apiRequest("/reservations/");
}

export function getActiveReservation() {
    return apiRequest("/reservations/active/");
}

export function createDraftReservation(bookingData) {
    return apiRequest("/reservations/draft/", {
        method: "POST",
        body: JSON.stringify(bookingData),
    });
}

export function updateDraftMenu(selectedMenuItemIds) {
    return apiRequest("/reservations/draft/menu/", {
        method: "PATCH",
        body: JSON.stringify({
            selected_menu_item_ids: selectedMenuItemIds,
        }),
    });
}

export function finalizeDraftReservation() {
    return apiRequest("/reservations/draft/finalize/", {
        method: "POST",
    });
}

export function verifyReservationOtp(referenceCode, otp) {
    return apiRequest("/reservations/otp/verify/", {
        method: "POST",
        body: JSON.stringify({
            reference_code: referenceCode,
            otp,
        }),
    });
}

export function resendReservationOtp(referenceCode) {
    return apiRequest("/reservations/otp/resend/", {
        method: "POST",
        body: JSON.stringify({
            reference_code: referenceCode,
        }),
    });
}

export function cancelReservation(referenceCode) {
    return apiRequest(
        `/reservations/${referenceCode}/cancel/`,
        {
            method: "POST",
        },
    );
}