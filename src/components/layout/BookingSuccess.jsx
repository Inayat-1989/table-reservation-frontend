import "../../assets/css/BookingSuccess.css";

import { menuItemsData } from "../../services/menu-items";

const BookingSuccess = ({ booking, onBookAnother }) => {
  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "Not provided";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not provided";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return "Not provided";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Not provided";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const selectedMenuItemIds =
    booking?.selected_menu_items ?? [];

  const selectedItems = menuItemsData.filter((item) =>
    selectedMenuItemIds.includes(item.id),
  );

  const guestCount = Number(booking?.guest_count);

  return (
    <section
      id="booking-success"
      className="booking-success section"
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-xl-7">
            <div className="booking-success-card">
              {/* Success Icon */}
              <div className="booking-success-icon">
                <i className="bi bi-check-lg"></i>
              </div>

              <span className="booking-success-label">
                Reservation Confirmed
              </span>

              <h2>Thank You for Your Booking!</h2>

              <p className="booking-success-message">
                Your email has been verified and your reservation
                is confirmed. We look forward to welcoming you!
              </p>

              {/* Reservation Reference */}
              {booking?.reference_code && (
                <div className="booking-reference">
                  <span>Reservation Reference</span>
                  <strong>
                    {booking.reference_code}
                  </strong>
                </div>
              )}

              {/* Reservation Details */}
              <div className="booking-success-details">
                <h4>Reservation Details</h4>

                {/* Name */}
                <div className="booking-detail-row">
                  <i className="bi bi-person"></i>

                  <div>
                    <span>Name</span>
                    <strong>
                      {booking?.customer_name ||
                        "Not provided"}
                    </strong>
                  </div>
                </div>

                {/* Email */}
                <div className="booking-detail-row">
                  <i className="bi bi-envelope"></i>

                  <div>
                    <span>Email</span>
                    <strong>
                      {booking?.customer_email ||
                        "Not provided"}
                    </strong>
                  </div>
                </div>

                {/* Phone */}
                <div className="booking-detail-row">
                  <i className="bi bi-telephone"></i>

                  <div>
                    <span>Phone</span>
                    <strong>
                      {booking?.customer_phone ||
                        "Not provided"}
                    </strong>
                  </div>
                </div>

                {/* Date */}
                <div className="booking-detail-row">
                  <i className="bi bi-calendar-event"></i>

                  <div>
                    <span>Date</span>
                    <strong>
                      {formatDate(booking?.slot_start)}
                    </strong>
                  </div>
                </div>

                {/* Time */}
                <div className="booking-detail-row">
                  <i className="bi bi-clock"></i>

                  <div>
                    <span>Time</span>
                    <strong>
                      {formatTime(booking?.slot_start)}
                    </strong>
                  </div>
                </div>

                {/* Guests */}
                <div className="booking-detail-row">
                  <i className="bi bi-people"></i>

                  <div>
                    <span>Guests</span>

                    <strong>
                      {Number.isFinite(guestCount) &&
                      guestCount > 0
                        ? `${guestCount} ${
                            guestCount === 1
                              ? "Person"
                              : "People"
                          }`
                        : "Not provided"}
                    </strong>
                  </div>
                </div>

                {/* Customer Note */}
                {booking?.customer_note && (
                  <div className="booking-detail-row">
                    <i className="bi bi-chat-left-text"></i>

                    <div>
                      <span>Note</span>
                      <strong>
                        {booking.customer_note}
                      </strong>
                    </div>
                  </div>
                )}

                {/* Selected Menu Items */}
                {selectedItems.length > 0 && (
                  <div className="booking-selected-menu">
                    <h5>Selected Menu Items</h5>

                    <ul>
                      {selectedItems.map((item) => (
                        <li key={item.id}>
                          <span>{item.title}</span>

                          <strong>
                            {item.price}
                          </strong>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Information Note */}
              <div className="booking-success-note">
                <i className="bi bi-info-circle me-2"></i>

                Please keep your reservation reference
                for future correspondence.
              </div>

              {/* Make Another Reservation */}
              <button
                type="button"
                className="btn-get-started btn-get-started form-button"
                onClick={onBookAnother}
              >
                Make Another Reservation

                <i className="bi bi-arrow-right ms-2"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingSuccess;