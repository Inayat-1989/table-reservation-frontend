export const formatDate = (dateValue) => {
  if (!dateValue) return "Not provided";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatTime = (dateValue) => {
  if (!dateValue) return "Not provided";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Not provided";

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const getStatusLabel = (status) => {
  const labels = {
    DRAFT: "Draft",
    PENDING_VERIFICATION: "Pending Verification",
    CONFIRMED: "Confirmed",
    CANCELLED: "Cancelled",
    COMPLETED: "Completed",
    EXPIRED: "Expired",
  };

  return labels[status] ?? status ?? "Unknown";
};

export const getStatusClass = (status) => {
  const classes = {
    CONFIRMED: "confirmed",
    PENDING_VERIFICATION: "pending",
    CANCELLED: "cancelled",
    COMPLETED: "completed",
    EXPIRED: "expired",
    DRAFT: "draft",
  };

  return classes[status] ?? "";
};

export const isCancellationDisabled = (reservation, isCancelling) =>
  isCancelling ||
  ["CANCELLED", "COMPLETED", "EXPIRED", "DRAFT"].includes(reservation.status);

export const getCancelButtonLabel = (reservation, isCancelling) => {
  if (reservation.status === "CANCELLED") return "Cancelled";
  if (isCancelling) return "Cancelling...";

  return "Cancel";
};
