import { useEffect, useState } from "react";

import { getReservations, cancelReservation } from "../../api/reservationApi";

import { menuItemsData } from "../../services/menu-items";

import ReservationTable from "./my-reservations/ReservationTable";
import ReservationDetailsModal from "./my-reservations/ReservationDetailsModal";

import "../../assets/css/MyReservations.css";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [error, setError] = useState("");
  const [selectedReservationCode, setSelectedReservationCode] = useState(null);

  const selectedReservation = reservations.find(
    (reservation) => reservation.reference_code === selectedReservationCode,
  );

  useEffect(() => {
    const loadReservations = async () => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getReservations();

        const data =
          response?.results ?? response?.reservations ?? response ?? [];

        setReservations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("My Reservations: Failed to load reservations:", error);

        setError(
          error.code === "SESSION_NOT_FOUND"
            ? "No reservation session was found."
            : error.message ||
                "Unable to load your reservations. Please try again.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadReservations();
  }, []);

  const getSelectedMenuItems = (reservation) => {
    const selectedIds = reservation?.selected_menu_items ?? [];

    return menuItemsData.filter(
      (item) => selectedIds.includes(item.id) && item.isSpecial,
    );
  };

  const handleCancel = async (referenceCode) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation? This action may not be reversible.",
    );

    if (!confirmed) return;

    try {
      setIsCancelling(true);
      setCancelError("");

      const updatedReservation = await cancelReservation(referenceCode);

      setReservations((currentReservations) =>
        currentReservations.map((reservation) =>
          reservation.reference_code === referenceCode
            ? { ...reservation, ...updatedReservation }
            : reservation,
        ),
      );
    } catch (error) {
      console.error("Failed to cancel reservation:", error);

      setCancelError(
        error.message || "Unable to cancel this reservation. Please try again.",
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const renderPageTitle = () => (
    <div className="section-title">
      <h2>My Reservations</h2>

      <p>
        <span>Your</span>{" "}
        <span className="description-title">Reservations</span>
      </p>
    </div>
  );

  if (isLoading) {
    return (
      <section id="my-reservations" className="my-reservations section">
        <div className="container">
          {renderPageTitle()}

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
          {renderPageTitle()}

          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-circle me-2" />
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
          {renderPageTitle()}

          <div className="my-reservations-empty">
            <div className="my-reservations-empty-icon">
              <i className="bi bi-calendar-x" />
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
        {renderPageTitle()}

        {cancelError && (
          <div className="alert alert-danger" role="alert">
            <i className="bi bi-exclamation-circle me-2" />
            {cancelError}
          </div>
        )}

        <ReservationTable
          reservations={reservations}
          isCancelling={isCancelling}
          onCancel={handleCancel}
          onSelect={setSelectedReservationCode}
          getSelectedMenuItems={getSelectedMenuItems}
        />
      </div>

      <ReservationDetailsModal
        reservation={selectedReservation}
        selectedItems={
          selectedReservation ? getSelectedMenuItems(selectedReservation) : []
        }
        isCancelling={isCancelling}
        onClose={() => setSelectedReservationCode(null)}
        onCancel={handleCancel}
      />
    </section>
  );
};

export default MyReservations;
