import { useState } from "react";

import {
  updateDraftMenu,
  finalizeDraftReservation,
} from "../../api/reservationApi";

import { menuItemsData } from "../../services/menu-items";
import "../../assets/css/MenuSelection.css";

const MenuSelection = ({ booking, onContinue }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSpecialMenuEligible = booking?.special_menu_eligible === true;

  const visibleMenuItems = menuItemsData.filter((item) => {
    if (item.isSpecial && !isSpecialMenuEligible) {
      return false;
    }

    return true;
  });

  const handleItemToggle = (item) => {
    if (!item.isAvailable || isSubmitting) {
      return;
    }

    setSubmitError("");

    setSelectedItems((previousItems) => {
      const alreadySelected = previousItems.some(
        (selectedItem) => selectedItem.id === item.id,
      );

      if (alreadySelected) {
        return previousItems.filter(
          (selectedItem) => selectedItem.id !== item.id,
        );
      }

      return [...previousItems, item];
    });
  };

  const handleContinue = async () => {
    if (isSubmitting) {
      return;
    }

    setSubmitError("");

    const selectedMenuItemIds = selectedItems.map((item) => item.id);

    try {
      setIsSubmitting(true);

      const updatedReservation = await updateDraftMenu(selectedMenuItemIds);

      console.log(
        "Menu Selection : Updated Draft Reservation:",
        updatedReservation,
      );

      const pendingReservation = await finalizeDraftReservation();

      console.log(
        "Menu Selection : Pending Verification Reservation:",
        pendingReservation,
      );

      onContinue(pendingReservation);
    } catch (error) {
      console.error("Menu Selection : Failed to finalize reservation:", error);

      if (error.code === "SESSION_NOT_FOUND") {
        setSubmitError(
          "Your reservation session could not be found. Please start the booking again.",
        );
      } else if (error.code === "SLOT_CAPACITY_EXCEEDED") {
        setSubmitError(
          "There are no longer enough seats available for this time. Please go back and select another time.",
        );
      } else if (error.code === "INVALID_MENU_SELECTION") {
        setSubmitError(
          error.message ||
            "One or more selected menu items are no longer available.",
        );
      } else if (error.code === "RESERVATION_STATE_ERROR") {
        setSubmitError(
          error.message || "Your reservation can no longer be finalized.",
        );
      } else if (error.code === "RESERVATION_ERROR") {
        setSubmitError(
          error.message ||
            "The reservation could not be completed. Please try again.",
        );
      } else {
        setSubmitError(
          error.message ||
            "Something went wrong while finalizing your reservation. Please try again.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSelected = (itemId) => {
    return selectedItems.some((item) => item.id === itemId);
  };

  return (
    <section id="menu-selection" className="menu-selection section">
      <div className="container">
        {/* Page Header */}
        <div className="section-title">
          <h2>Select Your Menu</h2>

          <p>
            <span>Choose</span>{" "}
            <span className="description-title">Your Food</span>
          </p>
        </div>

        {/* Booking Information */}
        {booking && (
          <div className="mb-4">
            <p className="text-center mb-0">
              Select the items you would like to add to your reservation.
            </p>
          </div>
        )}

        {/* Menu Items */}
        <div className="row gy-4">
          {visibleMenuItems.map((item) => {
            const selected = isSelected(item.id);

            return (
              <div className="col-lg-4 col-md-6" key={item.id}>
                <div
                  className={`menu-selection-item h-100 ${
                    !item.isAvailable ? "unavailable" : ""
                  } ${
                    item.isSpecial ? "special-item" : ""
                  } ${selected ? "selected" : ""}`}
                  onClick={() => handleItemToggle(item)}
                  role={item.isAvailable ? "button" : undefined}
                  tabIndex={item.isAvailable ? 0 : -1}
                >
                  {/* Image */}
                  <div className="menu-selection-image position-relative">
                    <img
                      src={item.src}
                      className="img-fluid w-100"
                      alt={item.title}
                    />

                    {/* Special Badge */}
                    {item.isSpecial && (
                      <span className="menu-special-badge">
                        <i className="bi bi-star-fill me-1"></i>
                        Special
                      </span>
                    )}

                    {/* Unavailable Overlay */}
                    {!item.isAvailable && (
                      <div className="menu-unavailable-overlay">
                        <span>Unavailable</span>
                      </div>
                    )}

                    {/* Selected Indicator */}
                    {selected && (
                      <div className="menu-selected-indicator">
                        <i className="bi bi-check-lg"></i>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="menu-selection-content">
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <h4>{item.title}</h4>

                        {/* Special Label */}
                        {item.isSpecial && (
                          <span className="menu-special-label">
                            <i className="bi bi-star-fill me-1"></i>
                            Special
                          </span>
                        )}
                      </div>

                      <span className="menu-price">{item.price}</span>
                    </div>

                    <p>{item.description}</p>

                    {/* Selection Status */}
                    {item.isAvailable ? (
                      <div className="menu-selection-status">
                        {selected ? (
                          <>
                            <i className="bi bi-check-circle-fill me-1"></i>
                            Selected
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-circle me-1"></i>
                            Select
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="menu-selection-status unavailable-text">
                        <i className="bi bi-x-circle me-1"></i>
                        Currently unavailable
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error */}
        {submitError && (
          <div className="alert alert-danger mt-4" role="alert">
            <i className="bi bi-exclamation-circle me-2"></i>
            {submitError}
          </div>
        )}

        {/* Continue */}
        <div className="text-center mt-5">
          <button
            type="button"
            className="btn-get-started form-button"
            onClick={handleContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></span>
                Confirming Reservation...
              </>
            ) : (
              <>
                Continue
                <i className="bi bi-arrow-right ms-2"></i>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuSelection;
