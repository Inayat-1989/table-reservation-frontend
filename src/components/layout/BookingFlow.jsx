import { useEffect, useState, useRef, useLayoutEffect } from "react";

import { getActiveReservation } from "../../api/reservationApi";

import BookATable from "./BookATable";
import MenuSelection from "./MenuSelection";
import EmailVerification from "./EmailVerification";
import BookingSuccess from "./BookingSuccess";

const BookingFlow = () => {
  const [step, setStep] = useState("details");
  const [booking, setBooking] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const bookingFlowRef = useRef(null);
const previousStepRef = useRef(null);

  useEffect(() => {
    const restoreBooking = async () => {
      try {
        const response = await getActiveReservation();

        const reservation = response.reservation ?? null;

        if (!reservation) {
          setBooking(null);
          setStep("details");
          return;
        }

        setBooking(reservation);

        switch (reservation.status) {
          case "DRAFT":
            setStep("menu");
            break;

          case "PENDING_VERIFICATION":
            setStep("verification");
            break;

          case "CONFIRMED":
            setStep("details");
            break;

          default:
            setBooking(null);
            setStep("details");
        }
      } catch (error) {
        console.error("Booking Flow : Failed to restore reservation:", error);

        setBooking(null);
        setStep("details");
      } finally {
        setIsRestoring(false);
      }
    };

    restoreBooking();
  }, []);

  useLayoutEffect(() => {
    // Don't scroll while restoring the booking from the API.
    if (isRestoring) return;

    // Skip the initial render; only handle actual step transitions.
    if (previousStepRef.current === null) {
      previousStepRef.current = step;
      return;
    }

    if (previousStepRef.current === step) return;

    previousStepRef.current = step;

    const element = bookingFlowRef.current;
    if (!element) return;

    const headerHeight =
      document.getElementById("header")?.offsetHeight ?? 0;

    const targetY =
      element.getBoundingClientRect().top +
      window.scrollY -
      headerHeight -
      16;

    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: "smooth",
    });
  }, [step, isRestoring]);

  const handleBookingSubmit = (reservation) => {
    setBooking(reservation);

    setStep("menu");
  };

  const handleMenuContinue = (reservation) => {
    setBooking(reservation);

    console.log("Booking Flow : Pending Verification:", reservation);

    setStep("verification");
  };

  const handleEmailVerified = (reservation) => {
    setBooking(reservation);

    console.log("Booking Flow : Confirmed Reservation:", reservation);

    setStep("success");
  };

  const handleBookingCancelled = () => {
    setBooking(null);
    setStep("details");
  };

  const handleBookAnother = () => {
    setBooking(null);
    setStep("details");
  };

  return (
    <div id="book-a-table" ref={bookingFlowRef}>
      {isRestoring ? (
        <div className="container py-5 text-center" role="status">
          <p>Restoring your booking...</p>
        </div>
      ) : (
        <>
          {step === "details" && (
            <BookATable onBookingSubmit={handleBookingSubmit} />
          )}

          {step === "menu" && (
            <MenuSelection
              booking={booking}
              onContinue={handleMenuContinue}
              onBack={() => setStep("details")}
              onCancelDraft={handleBookingCancelled}
            />
          )}

          {step === "verification" && (
            <EmailVerification
              booking={booking}
              onVerified={handleEmailVerified}
              onCancelled={handleBookingCancelled}
            />
          )}

          {step === "success" && (
            <BookingSuccess
              booking={booking}
              onBookAnother={handleBookAnother}
            />
          )}
        </>
      )}
    </div>
  );
};

export default BookingFlow;
