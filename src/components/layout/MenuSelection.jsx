import { useCallback, useEffect, useState } from "react";

import {
  updateDraftMenu,
  finalizeDraftReservation,
  getAvailableMenu,
  cancelDraftReservation,
} from "../../api/reservationApi";

import "../../assets/css/MenuSelection.css";

import MenuSelectionHeader from "./menu-selection/MenuSelectionHeader";
import MenuSelectionState from "./menu-selection/MenuSelectionState";
import MenuItemsGrid from "./menu-selection/MenuItemsGrid";
import MenuSelectionError from "./menu-selection/MenuSelectionError";
import MenuSelectionActions from "./menu-selection/MenuSelectionActions";
import ConfirmActionModal from "../common/ConfirmActionModal";
const getMenuItemsFromResponse = (response) => {
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

const MenuSelection = ({ booking, onContinue, onBack, onCancelDraft }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [menuError, setMenuError] = useState("");
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCancellingDraft, setIsCancellingDraft] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  // The backend is the source of truth for eligibility.
  const isSpecialMenuEligible = booking?.special_menu_eligible === true;

  const isActionInProgress = isSubmitting || isCancellingDraft;

  const loadMenu = useCallback(async () => {
    setIsLoadingMenu(true);
    setMenuError("");

    try {
      const response = await getAvailableMenu();

      const items = getMenuItemsFromResponse(response)
        .map(normalizeMenuItem)
        .filter(
          (item) => item.id != null && item.isAvailable && item.isSpecial,
        );

      setMenuItems(items);

      // Keep only selections that remain available.
      setSelectedItems((previousItems) =>
        previousItems.filter((selectedItem) =>
          items.some((item) => item.id === selectedItem.id),
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

  const visibleMenuItems = isSpecialMenuEligible ? menuItems : [];

  const handleItemToggle = (item) => {
    if (!item.isAvailable || isSubmitting || isCancellingDraft) {
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

  const handleBack = () => {
    if (isActionInProgress) {
      return;
    }

    onBack?.();
  };

  const handleCancelDraft = () => {
    if (isActionInProgress) {
      return;
    }

    setSubmitError("");
    setIsCancelModalOpen(true);
  };

  const confirmCancelDraft = async () => {
    if (isActionInProgress || !isCancelModalOpen) {
      return;
    }

    try {
      setIsCancellingDraft(true);
      setSubmitError("");

      await cancelDraftReservation();

      setIsCancelModalOpen(false);

      // Leave the booking flow only after successful cancellation.
      onCancelDraft?.();
    } catch (error) {
      console.error("Menu Selection: Failed to cancel draft:", error);

      setSubmitError(
        error.message ||
          "Unable to cancel the draft reservation. Please try again.",
      );
    } finally {
      setIsCancellingDraft(false);
    }
  };

  const handleContinue = async () => {
    if (isActionInProgress || isLoadingMenu || menuError) {
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

  return (
    <section id="menu-selection" className="menu-selection section">
      <div className="container">
        <MenuSelectionHeader booking={booking} />

        <MenuSelectionState
          isLoading={isLoadingMenu}
          menuError={menuError}
          isSpecialMenuEligible={isSpecialMenuEligible}
          visibleItemCount={visibleMenuItems.length}
          onRetry={loadMenu}
          isActionInProgress={isActionInProgress}
        />

        {!isLoadingMenu && !menuError && visibleMenuItems.length > 0 && (
          <MenuItemsGrid
            items={visibleMenuItems}
            selectedItems={selectedItems}
            disabled={isActionInProgress}
            onToggle={handleItemToggle}
          />
        )}

        <MenuSelectionError message={isCancelModalOpen ? "" : submitError} />
        <MenuSelectionActions
          onBack={handleBack}
          onCancelDraft={handleCancelDraft}
          onContinue={handleContinue}
          isSubmitting={isSubmitting}
          isCancellingDraft={isCancellingDraft}
          isLoadingMenu={isLoadingMenu}
          menuError={menuError}
        />
      </div>

      <ConfirmActionModal
        isOpen={isCancelModalOpen}
        title="Cancel This Booking?"
        message="Are you sure you want to cancel your draft reservation? Your current booking progress will be lost, and this action cannot be undone."
        confirmText="Confirm Cancellation"
        cancelText="Keep Booking"
        isLoading={isCancellingDraft}
        error={isCancelModalOpen ? submitError : ""}
        variant="danger"
        onConfirm={confirmCancelDraft}
        onClose={() => {
          if (isCancellingDraft) return;

          setIsCancelModalOpen(false);
          setSubmitError("");
        }}
      />
    </section>
  );
};

export default MenuSelection;
