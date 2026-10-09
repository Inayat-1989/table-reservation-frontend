import { useCallback, useEffect, useState } from "react";

import {
  updateDraftMenu,
  finalizeDraftReservation,
  getAvailableMenu,
} from "../../api/reservationApi";

import "../../assets/css/MenuSelection.css";

const getMenuItemsFromResponse = (response) => {
  // Support common Django REST Framework response formats.
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  return [];
};

const normalizeMenuItem = (item) => ({
  ...item,
  id: item.id,
  title: item.title ?? item.name ?? "",
  description: item.description ?? "",
  src: item.src ?? item.image ?? item.image_url ?? "",
  price: item.price,
  isSpecial: item.is_special ?? item.isSpecial ?? false,
  isAvailable: item.is_available ?? item.isAvailable ?? true,
});

const MenuSelection = ({ booking, onContinue }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [menuError, setMenuError] = useState("");
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSpecialMenuEligible = booking?.special_menu_eligible === true;

  const loadMenu = useCallback(async () => {
    setIsLoadingMenu(true);
    setMenuError("");

    try {
      const response = await getAvailableMenu();
      const items = getMenuItemsFromResponse(response)
        .map(normalizeMenuItem)
        .filter((item) => item.id != null);

      setMenuItems(items);

      // Remove selections that are no longer available in the response.
      setSelectedItems((previousItems) =>
        previousItems.filter((selectedItem) =>
          items.some((item) => item.id === selectedItem.id && item.isAvailable),
        ),
      );
    } catch (error) {
      console.error("Menu Selection: Failed to load menu:", error);

      setMenuError(
        error.message || "Unable to load the menu. Please try again.",
      );
    } finally {
      setIsLoadingMenu(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadMenu();
  }, [loadMenu]);

  const visibleMenuItems = menuItems.filter((item) => {
    if (item.isSpecial && !isSpecialMenuEligible) {
      return false;
    }

    return true;
  });

  const isSelected = (itemId) =>
    selectedItems.some((item) => item.id === itemId);

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
    if (isSubmitting || isLoadingMenu || menuError) {
      return;
    }

    setSubmitError("");

    const selectedMenuItemIds = selectedItems.map((item) => item.id);

    try {
      setIsSubmitting(true);

      const updatedReservation = await updateDraftMenu(selectedMenuItemIds);

      console.log(
        "Menu Selection: Updated Draft Reservation:",
        updatedReservation,
      );

      const pendingReservation = await finalizeDraftReservation();

      console.log(
        "Menu Selection: Pending Verification Reservation:",
        pendingReservation,
      );

      onContinue(pendingReservation);
    } catch (error) {
      console.error("Menu Selection: Failed to finalize reservation:", error);

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

  const formatPrice = (price) => {
    if (price == null || price === "") {
      return "";
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return price;
    }

    return `Rs. ${numericPrice.toLocaleString("en-PK")}`;
  };

  return (
    <section id="menu-selection" className="menu-selection section">
      {" "}
      <div className="container">
        {" "}
        <div className="section-title">
          {" "}
          <h2>Select Your Menu</h2>{" "}
          <p>
            {" "}
            <span>Choose</span>{" "}
            <span className="description-title">Your Food</span>{" "}
          </p>{" "}
        </div>
        {booking && (
          <div className="mb-4">
            <p className="text-center mb-0">
              Select the items you would like to add to your reservation.
            </p>
          </div>
        )}
        {/* Loading state */}
        {isLoadingMenu && (
          <div className="text-center py-5" role="status">
            <span className="spinner-border text-danger" aria-hidden="true" />
            <p className="mt-3">Loading menu items...</p>
          </div>
        )}
        {/* Fetch error and retry */}
        {!isLoadingMenu && menuError && (
          <div className="alert alert-danger mt-4" role="alert">
            <p className="mb-2">{menuError}</p>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={loadMenu}
            >
              Try Again
            </button>
          </div>
        )}
        {/* Menu items */}
        {!isLoadingMenu && !menuError && (
          <>
            {visibleMenuItems.length === 0 ? (
              <div className="text-center py-5">
                <p>No menu items are currently available to display.</p>
              </div>
            ) : (
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
                        onKeyDown={(event) => {
                          if (
                            item.isAvailable &&
                            (event.key === "Enter" || event.key === " ")
                          ) {
                            event.preventDefault();
                            handleItemToggle(item);
                          }
                        }}
                        role="button"
                        aria-pressed={selected}
                        aria-disabled={!item.isAvailable || isSubmitting}
                        tabIndex={item.isAvailable && !isSubmitting ? 0 : -1}
                      >
                        <div className="menu-selection-image position-relative">
                          {item.src ? (
                            <img
                              src={item.src}
                              className="img-fluid w-100"
                              alt={item.title}
                              loading="lazy"
                            />
                          ) : (
                            <div className="text-center p-5">
                              Image unavailable
                            </div>
                          )}

                          {item.isSpecial && (
                            <span className="menu-special-badge">
                              <i className="bi bi-star-fill me-1" />
                              Special
                            </span>
                          )}

                          {!item.isAvailable && (
                            <div className="menu-unavailable-overlay">
                              <span>Unavailable</span>
                            </div>
                          )}

                          {selected && (
                            <div className="menu-selected-indicator">
                              <i className="bi bi-check-lg" />
                            </div>
                          )}
                        </div>

                        <div className="menu-selection-content">
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div>
                              <h4>{item.title}</h4>

                              {item.isSpecial && (
                                <span className="menu-special-label">
                                  <i className="bi bi-star-fill me-1" />
                                  Special
                                </span>
                              )}
                            </div>

                            <span className="menu-price">
                              {formatPrice(item.price)}
                            </span>
                          </div>

                          <p>{item.description}</p>

                          {item.isAvailable ? (
                            <div className="menu-selection-status">
                              {selected ? (
                                <>
                                  <i className="bi bi-check-circle-fill me-1" />
                                  Selected
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-plus-circle me-1" />
                                  Select
                                </>
                              )}
                            </div>
                          ) : (
                            <div className="menu-selection-status unavailable-text">
                              <i className="bi bi-x-circle me-1" />
                              Currently unavailable
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
        {/* Reservation submission error */}
        {submitError && (
          <div className="alert alert-danger mt-4" role="alert">
            <i className="bi bi-exclamation-circle me-2" />
            {submitError}
          </div>
        )}
        {/* Continue */}
        <div className="text-center mt-5">
          <button
            type="button"
            className="btn-get-started form-button"
            onClick={handleContinue}
            disabled={isSubmitting || isLoadingMenu || !!menuError}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                />
                Confirming Reservation...
              </>
            ) : (
              <>
                Continue
                <i className="bi bi-arrow-right ms-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuSelection;
