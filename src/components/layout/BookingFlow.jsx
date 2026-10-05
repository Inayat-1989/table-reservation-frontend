import { useEffect, useState } from "react";

import { getActiveReservation } from "../../api/reservationApi";

import BookATable from "./BookATable";
import MenuSelection from "./MenuSelection";
import EmailVerification from "./EmailVerification";
import BookingSuccess from "./BookingSuccess";

const BookingFlow = () => {
  const [step, setStep] = useState("details");
  const [booking, setBooking] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreBooking = async () => {
      try {
        const response = await getActiveReservation();

        const reservation = response?.reservation ?? null;

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
            setStep("success");
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

  const handleBookingSubmit = (reservation) => {
    setBooking(reservation);

    console.log("Booking Flow : Draft Reservation:", reservation);

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

  if (isRestoring) {
    return null;
  }

  return (
    <>
      {step === "details" && (
        <BookATable onBookingSubmit={handleBookingSubmit} />
      )}

      {step === "menu" && (
        <MenuSelection booking={booking} onContinue={handleMenuContinue} />
      )}

      {step === "verification" && (
        <EmailVerification
          booking={booking}
          onVerified={handleEmailVerified}
          onCancelled={handleBookingCancelled}
        />
      )}

      {step === "success" && (
        <BookingSuccess booking={booking} onBookAnother={handleBookAnother} />
      )}
    </>
  );
};

export default BookingFlow;
