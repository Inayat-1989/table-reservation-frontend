
import { useEffect, useRef } from "react";

import {
  formatDate,
  formatTime,
  getStatusClass,
  getStatusLabel,
  isCancellationDisabled,
  getCancelButtonLabel,
} from "./reservationUtils";

const MobileReservationCarousel = ({
  reservations,
  isCancelling,
  onCancel,
  onSelect,
  getSelectedMenuItems,
  totalCount,
  hasNextPage,
  isLoadingMore,
  onLoadMore,
}) => {
  const sentinelRef = useRef(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (
      !sentinel ||
      !hasNextPage ||
      isLoadingMore ||
      !("IntersectionObserver" in window)
    ) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "0px 0px 250px 0px",
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasNextPage, isLoadingMore, onLoadMore]);

  if (reservations.length === 0) {
    return null;
  }

  return (
    <div className="mobile-reservations">
      <div className="mobile-reservations-header">
        <h3>Reservation History</h3>

        <span className="mobile-reservations-count">
          {totalCount}{" "}
          {totalCount === 1 ? "reservation" : "reservations"}
        </span>
      </div>

      <div className="mobile-reservation-list">
        {reservations.map((reservation) => {
          const selectedItems = getSelectedMenuItems(reservation);

          return (
            <article
              key={reservation.reference_code}
              className="mobile-reservation-card"
              aria-label={`Reservation ${reservation.reference_code}`}
            >
              <div className="mobile-reservation-card-header">
                <div className="mobile-reservation-reference">
                  <span>Reservation Reference</span>
                  <h4>{reservation.reference_code}</h4>
                </div>

                <span
                  className={`reservation-status ${getStatusClass(
                    reservation.status,
                  )}`}
                >
                  {getStatusLabel(reservation.status)}
                </span>
              </div>

              <div className="mobile-reservation-details">
                <div className="mobile-reservation-detail">
                  <i className="bi bi-calendar3" />
                  <div>
                    <span>Date</span>
                    <strong>
                      {formatDate(reservation.slot_start)}
                    </strong>
                  </div>
                </div>

                <div className="mobile-reservation-detail">
                  <i className="bi bi-clock" />
                  <div>
                    <span>Time Slot</span>
                    <strong>
                      {formatTime(reservation.slot_start)}
                    </strong>
                  </div>
                </div>

                <div className="mobile-reservation-detail">
                  <i className="bi bi-people" />
                  <div>
                    <span>Guests</span>
                    <strong>
                      {reservation.guest_count ?? "Not provided"}
                      {reservation.guest_count != null
                        ? Number(reservation.guest_count) === 1
                          ? " Guest"
                          : " Guests"
                        : ""}
                    </strong>
                  </div>
                </div>

                <div className="mobile-reservation-detail">
                  <i className="bi bi-star" />
                  <div>
                    <span>Special Menu</span>
                    <strong>
                      {selectedItems.length > 0
                        ? `${selectedItems.length} special ${
                            selectedItems.length === 1 ? "item" : "items"
                          }`
                        : "None selected"}
                    </strong>
                  </div>
                </div>
              </div>

              {reservation.customer_note && (
                <div className="mobile-reservation-note">
                  <span>
                    <i className="bi bi-chat-left-text" /> Customer Note
                  </span>
                  <p>{reservation.customer_note}</p>
                </div>
              )}

              <div className="mobile-reservation-actions">
                <button
                  type="button"
                  className="mobile-reservation-details-button"
                  onClick={() =>
                    onSelect(reservation.reference_code)
                  }
                >
                  <i className="bi bi-eye" />
                  View Details
                </button>

                <button
                  type="button"
                  className="reservation-cancel-button"
                  disabled={isCancellationDisabled(
                    reservation,
                    isCancelling,
                  )}
                  onClick={() =>
                    onCancel(reservation.reference_code)
                  }
                >
                  {getCancelButtonLabel(reservation, isCancelling)}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div
        ref={sentinelRef}
        className="mobile-reservation-load-more"
        aria-live="polite"
      >
        {isLoadingMore && (
          <p>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            Loading more reservations...
          </p>
        )}

        {!hasNextPage && (
          <p>You've reached the end of your reservations.</p>
        )}
      </div>

      <p className="mobile-reservation-hint">
        <i className="bi bi-info-circle" />
        Select View Details to see the complete reservation information.
      </p>
    </div>
  );
};

export default MobileReservationCarousel;
