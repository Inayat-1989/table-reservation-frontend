import { useEffect, useState } from "react";

import { getReservations } from "../../api/reservationApi";
import { menuItemsData } from "../../services/menu-items";

import "../../assets/css/MyReservations.css";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getReservations();

        setReservations(
          response?.results ?? response?.reservations ?? response ?? [],
        );
      } catch (error) {
        console.error("My Reservations : Failed to load reservations:", error);

        if (error.code === "SESSION_NOT_FOUND") {
          setError("No reservation session was found.");
        } else {
          setError(
            error.message ||
              "Unable to load your reservations. Please try again.",
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadReservations();
  }, []);

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

  const getStatusLabel = (status) => {
    switch (status) {
      case "DRAFT":
        return "Draft";

      case "PENDING_VERIFICATION":
        return "Pending Verification";

      case "CONFIRMED":
        return "Confirmed";

      case "CANCELLED":
        return "Cancelled";

      case "COMPLETED":
        return "Completed";

      case "EXPIRED":
        return "Expired";

      default:
        return status || "Unknown";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "confirmed";

      case "PENDING_VERIFICATION":
        return "pending";

      case "CANCELLED":
        return "cancelled";

      case "COMPLETED":
        return "completed";

      case "EXPIRED":
        return "expired";

      case "DRAFT":
        return "draft";

      default:
        return "";
    }
  };

  const getSelectedMenuItems = (reservation) => {
    const selectedIds = reservation?.selected_menu_items ?? [];

    return menuItemsData.filter((item) => selectedIds.includes(item.id));
  };

  if (isLoading) {
    return (
      <section id="my-reservations" className="my-reservations section">
        <div className="container">
          <div className="section-title">
            <h2>My Reservations</h2>

            <p>
              <span>Your</span>{" "}
              <span className="description-title">Reservations</span>
            </p>
          </div>

          <div className="my-reservations-state">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>

            <p>Loading your reservations...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="my-reservations" className="my-reservations section">
        <div className="container">
          <div className="section-title">
            <h2>My Reservations</h2>

            <p>
              <span>Your</span>{" "}
              <span className="description-title">Reservations</span>
            </p>
          </div>

          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        </div>
      </section>
    );
  }

  if (reservations.length === 0) {
    return (
      <section id="my-reservations" className="my-reservations section">
        <div className="container">
          <div className="section-title">
            <h2>My Reservations</h2>

            <p>
              <span>Your</span>{" "}
              <span className="description-title">Reservations</span>
            </p>
          </div>

          <div className="my-reservations-empty">
            <div className="my-reservations-empty-icon">
              <i className="bi bi-calendar-x"></i>
            </div>

            <h3>No Reservations Yet</h3>

            <p>You don't have any reservations yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="my-reservations" className="my-reservations section">
      <div className="container">
        <div className="section-title">
          <h2>My Reservations</h2>

          <p>
            <span>Your</span>{" "}
            <span className="description-title">Reservations</span>
          </p>
        </div>

        <div className="row gy-4">
          {reservations.map((reservation) => {
            const selectedItems = getSelectedMenuItems(reservation);

            return (
              <div className="col-lg-6" key={reservation.reference_code}>
                <div className="reservation-card">
                  {/* Card Header */}
                  <div className="reservation-card-header">
                    <div>
                      <span className="reservation-reference-label">
                        Reservation Reference
                      </span>

                      <strong className="reservation-reference">
                        {reservation.reference_code}
                      </strong>
                    </div>

                    <span
                      className={`reservation-status ${getStatusClass(
                        reservation.status,
                      )}`}
                    >
                      {getStatusLabel(reservation.status)}
                    </span>
                  </div>

                  {/* Main Reservation Information */}
                  <div className="reservation-card-body">
                    <div className="reservation-info-grid">
                      <div className="reservation-info-item">
                        <i className="bi bi-person"></i>

                        <div>
                          <span>Name</span>

                          <strong>
                            {reservation.customer_name || "Not provided"}
                          </strong>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <i className="bi bi-envelope"></i>

                        <div>
                          <span>Email</span>

                          <strong>
                            {reservation.customer_email || "Not provided"}
                          </strong>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <i className="bi bi-calendar-event"></i>

                        <div>
                          <span>Date</span>

                          <strong>{formatDate(reservation.slot_start)}</strong>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <i className="bi bi-clock"></i>

                        <div>
                          <span>Time</span>

                          <strong>{formatTime(reservation.slot_start)}</strong>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <i className="bi bi-people"></i>

                        <div>
                          <span>Guests</span>

                          <strong>
                            {reservation.guest_count}{" "}
                            {Number(reservation.guest_count) === 1
                              ? "Person"
                              : "People"}
                          </strong>
                        </div>
                      </div>

                      <div className="reservation-info-item">
                        <i className="bi bi-telephone"></i>

                        <div>
                          <span>Phone</span>

                          <strong>
                            {reservation.customer_phone || "Not provided"}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Selected Menu */}
                    {selectedItems.length > 0 && (
                      <div className="reservation-menu">
                        <h5>Selected Menu</h5>

                        <ul>
                          {selectedItems.map((item) => (
                            <li
                              key={item.id}
                              className={
                                item.isSpecial ? "special-menu-item" : ""
                              }
                            >
                              <div className="reservation-menu-item-info">
                                <span>{item.title}</span>

                                {item.isSpecial && (
                                  <span className="special-menu-badge">
                                    ⭐ Special
                                  </span>
                                )}
                              </div>

                              <strong>{item.price}</strong>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Customer Note */}
                    {reservation.customer_note && (
                      <div className="reservation-note">
                        <i className="bi bi-chat-left-text"></i>

                        <div>
                          <span>Note</span>

                          <p>{reservation.customer_note}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MyReservations;
