import { useCallback, useEffect, useState } from "react";

import {
  getReservations,
  cancelReservation,
} from "../../api/reservationApi";

import { menuItemsData } from "../../services/menu-items";

import ReservationTable from "./my-reservations/ReservationTable";
import ReservationDetailsModal from "./my-reservations/ReservationDetailsModal";
import MobileReservationCarousel from "./my-reservations/MobileReservationCarousel";
import ConfirmActionModal from "../common/ConfirmActionModal";
import "../../assets/css/MyReservations.css";

const MyReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [cancelError, setCancelError] = useState("");
  const [error, setError] = useState("");

  const [selectedReservationCode, setSelectedReservationCode] =
    useState(null);
  const [pendingCancellationCode, setPendingCancellationCode] =
    useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [hasNextPage, setHasNextPage] = useState(false);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 767px)").matches
      : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleViewportChange = (event) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", handleViewportChange);

    return () => {
      mediaQuery.removeEventListener("change", handleViewportChange);
    };
  }, []);

  const pendingReservation = reservations.find(
    (reservation) =>
      reservation.reference_code === pendingCancellationCode,
  );

  const selectedReservation = reservations.find(
    (reservation) =>
      reservation.reference_code === selectedReservationCode,
  );

  const loadReservations = useCallback(
    async (pageNumber, { append = false, initial = false } = {}) => {
      try {
        if (initial) {
          setIsLoading(true);
        } else if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoadingPage(true);
        }

        setError("");

        const response = await getReservations(pageNumber);

        const results = Array.isArray(response?.results)
          ? response.results
          : [];

        setReservations((previous) => {
          if (!append) return results;

          const existingCodes = new Set(
            previous.map((item) => item.reference_code),
          );

          return [
            ...previous,
            ...results.filter(
              (item) => !existingCodes.has(item.reference_code),
            ),
          ];
        });

        setCurrentPage(pageNumber);
        setTotalCount(Number(response?.count ?? results.length));

        const receivedPageSize = Number(response?.page_size);

        if (Number.isFinite(receivedPageSize) && receivedPageSize > 0) {
          setPageSize(receivedPageSize);
        }

        setHasNextPage(Boolean(response?.next));
      } catch (requestError) {
        console.error(
          "My Reservations: Failed to load reservations:",
          requestError,
        );

        setError(
          requestError.code === "SESSION_NOT_FOUND"
            ? "No reservation session was found."
            : requestError.message ||
                "Unable to load your reservations. Please try again.",
        );
      } finally {
        setIsLoading(false);
        setIsLoadingPage(false);
        setIsLoadingMore(false);
      }
    },
    [],
  );

  // Load page one on entry and when switching between mobile and desktop.
  useEffect(() => {
    let active = true;

    const loadInitialPage = async () => {
      setIsLoading(true);
      setError("");
      setCurrentPage(1);
      setTotalCount(0);
      setHasNextPage(false);
      setReservations([]);

      try {
        const response = await getReservations(1);

        if (!active) return;

        const results = Array.isArray(response?.results)
          ? response.results
          : [];

        setReservations(results);
        setCurrentPage(1);
        setTotalCount(Number(response?.count ?? results.length));

        const receivedPageSize = Number(response?.page_size);

        if (Number.isFinite(receivedPageSize) && receivedPageSize > 0) {
          setPageSize(receivedPageSize);
        }

        setHasNextPage(Boolean(response?.next));
      } catch (requestError) {
        if (!active) return;

        console.error(
          "My Reservations: Failed to load reservations:",
          requestError,
        );

        setError(
          requestError.code === "SESSION_NOT_FOUND"
            ? "No reservation session was found."
            : requestError.message ||
                "Unable to load your reservations. Please try again.",
        );
      } finally {
        if (active) setIsLoading(false);
      }
    };

    loadInitialPage();

    return () => {
      active = false;
    };
  }, [isMobile]);

  // Avoid multiple automatic requests while the next mobile page is loading.
  const loadMoreReservations = useCallback(() => {
    if (!isMobile || isLoadingMore || isLoadingPage || !hasNextPage) {
      return;
    }

    loadReservations(currentPage + 1, { append: true });
  }, [
    isMobile,
    isLoadingMore,
    isLoadingPage,
    hasNextPage,
    currentPage,
    loadReservations,
  ]);

  const handlePreviousPage = () => {
    if (currentPage <= 1 || isLoadingPage) return;

    loadReservations(currentPage - 1);
  };

  const handleNextPage = () => {
    if (isLoadingPage || !hasNextPage) return;

    loadReservations(currentPage + 1);
  };

  const getSelectedMenuItems = (reservation) => {
    const selectedIds = reservation?.selected_menu_items ?? [];

    return menuItemsData.filter(
      (item) => selectedIds.includes(item.id) && item.isSpecial,
    );
  };

  const handleCancel = (referenceCode) => {
    if (isCancelling) return;

    setCancelError("");
    setPendingCancellationCode(referenceCode);
  };

  const confirmCancellation = async () => {
    if (!pendingReservation || isCancelling) return;

    const referenceCode = pendingReservation.reference_code;

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

      setPendingCancellationCode(null);

      setSelectedReservationCode((currentCode) =>
        currentCode === referenceCode ? null : currentCode,
      );
    } catch (requestError) {
      console.error("Failed to cancel reservation:", requestError);

      setCancelError(
        requestError.message ||
          "Unable to cancel this reservation. Please try again.",
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

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <section id="my-reservations" className="my-reservations section">
      <div className="container">
        {renderPageTitle()}

        {isMobile ? (
          <MobileReservationCarousel
            reservations={reservations}
            isCancelling={isCancelling}
            onCancel={handleCancel}
            onSelect={setSelectedReservationCode}
            getSelectedMenuItems={getSelectedMenuItems}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            isLoadingMore={isLoadingMore}
            onLoadMore={loadMoreReservations}
          />
        ) : (
          <ReservationTable
            reservations={reservations}
            isCancelling={isCancelling}
            onCancel={handleCancel}
            onSelect={setSelectedReservationCode}
            getSelectedMenuItems={getSelectedMenuItems}
            currentPage={currentPage}
            totalPages={totalPages}
            onPreviousPage={handlePreviousPage}
            onNextPage={handleNextPage}
            isLoadingPage={isLoadingPage}
          />
        )}
      </div>

      <ReservationDetailsModal
        reservation={selectedReservation}
        selectedItems={
          selectedReservation
            ? getSelectedMenuItems(selectedReservation)
            : []
        }
        isCancelling={isCancelling}
        onClose={() => setSelectedReservationCode(null)}
        onCancel={handleCancel}
      />

      <ConfirmActionModal
        isOpen={Boolean(pendingReservation)}
        title="Cancel Reservation?"
        message={
          pendingReservation
            ? `Are you sure you want to cancel reservation ${pendingReservation.reference_code}? This action cannot be undone.`
            : "Are you sure you want to cancel this reservation?"
        }
        confirmText="Cancel Reservation"
        cancelText="Keep Reservation"
        isLoading={isCancelling}
        error={cancelError}
        variant="danger"
        onConfirm={confirmCancellation}
        onClose={() => {
          if (isCancelling) return;

          setPendingCancellationCode(null);
          setCancelError("");
        }}
      />
    </section>
  );
};

export default MyReservations;