import { useEffect, useState } from "react";

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
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex((index) =>
      Math.min(index, Math.max(0, reservations.length - 1)),
    );
  }, [reservations.length]);

  if (reservations.length === 0) {
    return null;
  }

  const reservation = reservations[currentIndex];
  const selectedItems = getSelectedMenuItems(reservation);

  const goToPrevious = () => {
    setCurrentIndex((index) => Math.max(0, index - 1));
  };

  const goToNext = () => {
    setCurrentIndex((index) => Math.min(reservations.length - 1, index + 1));
  };

  return (
    <div className="mobile-reservations">
      <div className="mobile-reservations-header">
        <h3>Reservation History</h3>

        <span className="mobile-reservations-count">
          {reservations.length}{" "}
          {reservations.length === 1 ? "reservation" : "reservations"}
        </span>
      </div>

      <div className="mobile-reservation-carousel">
        <button
          type="button"
          className="mobile-reservation-arrow"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          aria-label="Previous reservation"
        >
          <i className="bi bi-chevron-left" />
        </button>

        <article
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
                  {formatDate(reservation.slot_start) || "Not provided"}
                </strong>
              </div>
            </div>

            <div className="mobile-reservation-detail">
              <i className="bi bi-clock" />
              <div>
                <span>Time Slot</span>
                <strong>
                  {formatTime(reservation.slot_start) || "Not provided"}
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
              onClick={() => onSelect(reservation.reference_code)}
            >
              <i className="bi bi-eye" />
              View Details
            </button>

            <button
              type="button"
              className="reservation-cancel-button"
              disabled={isCancellationDisabled(reservation, isCancelling)}
              onClick={() => onCancel(reservation.reference_code)}
            >
              {getCancelButtonLabel(reservation, isCancelling)}
            </button>
          </div>
        </article>

        <button
          type="button"
          className="mobile-reservation-arrow"
          onClick={goToNext}
          disabled={currentIndex === reservations.length - 1}
          aria-label="Next reservation"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      <div className="mobile-reservation-pagination">
        <span>
          {currentIndex + 1} of {reservations.length}
        </span>

        <div
          className="mobile-reservation-dots"
          aria-label="Choose reservation"
        >
          {reservations.map((item, index) => (
            <button
              key={item.reference_code}
              type="button"
              className={`mobile-reservation-dot ${
                index === currentIndex ? "active" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Show reservation ${index + 1}`}
              aria-current={index === currentIndex ? "true" : undefined}
            />
          ))}
        </div>
      </div>

      <p className="mobile-reservation-hint">
        <i className="bi bi-info-circle" /> Select View Details to see the
        complete reservation information.
      </p>
    </div>
  );
};

export default MobileReservationCarousel;
