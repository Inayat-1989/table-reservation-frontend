
import { useEffect, useState } from "react";

import {
  cancelReservation,
  resendReservationOtp,
  verifyReservationOtp,
  getReservationOtpExpiry,
} from "../../api/reservationApi";

import ConfirmActionModal from "../common/ConfirmActionModal";

import "../../assets/css/MenuSelection.css";

const EmailVerification = ({ booking, onVerified, onCancelled }) => {
  const reservationReference = booking?.reference_code;
  const customerEmail = booking?.customer_email;

  const [otp, setOtp] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isLoadingExpiry, setIsLoadingExpiry] = useState(true);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [status, setStatus] = useState({
    loading: false,
    verifying: false,
    resending: false,
    cancelling: false,
    error: "",
    success: "",
  });

  /*
   * Fetch the actual OTP expiry from Django.
   *
   * This does not send another OTP.
   * It only retrieves the expiry of the existing OTP.
   */
  useEffect(() => {
    let cancelled = false;

    const loadOtpExpiry = async () => {
      setIsLoadingExpiry(true);
      setOtpExpiresAt(null);
      setRemainingSeconds(0);

      try {
        if (!reservationReference) {
          throw new Error("Reservation information is missing.");
        }

        const response = await getReservationOtpExpiry(
          reservationReference,
        );

        if (cancelled) return;

        const expiry = response?.expires_at
          ? new Date(response.expires_at).getTime()
          : NaN;

        if (!Number.isFinite(expiry)) {
          throw new Error(
            "Unable to retrieve the verification code expiry time.",
          );
        }

        setOtpExpiresAt(expiry);

        setRemainingSeconds(
          Math.max(0, Math.ceil((expiry - Date.now()) / 1000)),
        );

        setStatus((previousStatus) => ({
          ...previousStatus,
          error: "",
        }));
      } catch (error) {
        if (cancelled) return;

        console.error(
          "Email Verification: Failed to load OTP expiry:",
          error,
        );

        setOtpExpiresAt(null);
        setRemainingSeconds(0);

        setStatus((previousStatus) => ({
          ...previousStatus,
          error:
            error.message ||
            "Unable to load the verification code expiry.",
        }));
      } finally {
        if (!cancelled) {
          setIsLoadingExpiry(false);
        }
      }
    };

    setOtp("");

    setStatus({
      loading: false,
      verifying: false,
      resending: false,
      cancelling: false,
      error: "",
      success: "",
    });

    loadOtpExpiry();

    return () => {
      cancelled = true;
    };
  }, [reservationReference]);

  /*
   * Update the countdown using the absolute expiry timestamp.
   *
   * Refreshing the page will not restart the timer because
   * the remaining time is calculated from the backend expiry.
   */
  useEffect(() => {
    if (otpExpiresAt === null) return undefined;

    const updateCountdown = () => {
      setRemainingSeconds(
        Math.max(
          0,
          Math.ceil((otpExpiresAt - Date.now()) / 1000),
        ),
      );
    };

    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [otpExpiresAt]);

  const formatTime = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds,
    ).padStart(2, "0")}`;
  };

  const handleOtpChange = (event) => {
    const value = event.target.value.replace(/\D/g, "");

    if (value.length <= 6) {
      setOtp(value);
    }

    setStatus((previousStatus) => ({
      ...previousStatus,
      error: "",
      success: "",
    }));
  };

  /*
   * Verify OTP.
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (status.verifying || status.cancelling) {
      return;
    }

    setStatus((previousStatus) => ({
      ...previousStatus,
      error: "",
      success: "",
    }));

    if (!reservationReference) {
      setStatus((previousStatus) => ({
        ...previousStatus,
        error: "Reservation information is missing.",
      }));

      return;
    }

    if (isLoadingExpiry || otpExpiresAt === null) {
      setStatus((previousStatus) => ({
        ...previousStatus,
        error:
          "The verification expiry could not be confirmed. Please try again.",
      }));

      return;
    }

    if (remainingSeconds <= 0) {
      setStatus((previousStatus) => ({
        ...previousStatus,
        error:
          "The verification code has expired. Please request a new code.",
      }));

      return;
    }

    if (otp.length !== 6) {
      setStatus((previousStatus) => ({
        ...previousStatus,
        error: "Please enter the 6-digit verification code.",
      }));

      return;
    }

    try {
      setStatus((previousStatus) => ({
        ...previousStatus,
        verifying: true,
        error: "",
      }));

      const reservation = await verifyReservationOtp(
        reservationReference,
        otp,
      );

      console.log(
        "Email Verification: Confirmed Reservation:",
        reservation,
      );

      setStatus({
        loading: false,
        verifying: false,
        resending: false,
        cancelling: false,
        error: "",
        success: "Email verified successfully.",
      });

      /*
       * Django has already changed the reservation
       * to CONFIRMED.
       */
      onVerified(reservation);
    } catch (error) {
      console.error(
        "Email Verification: OTP verification failed:",
        error,
      );

      setStatus((previousStatus) => ({
        ...previousStatus,
        verifying: false,
        error: error.message || "Unable to verify the code.",
        success: "",
      }));
    }
  };

  /*
   * Resend OTP and retrieve the new expiry from Django.
   */
  const handleResend = async () => {
    if (
      !reservationReference ||
      status.resending ||
      status.verifying ||
      status.cancelling
    ) {
      return;
    }

    setOtp("");

    setStatus({
      loading: false,
      verifying: false,
      resending: true,
      cancelling: false,
      error: "",
      success: "",
    });

    try {
      await resendReservationOtp(reservationReference);

      // Retrieve the expiry of the newly issued OTP.
      const expiryResponse = await getReservationOtpExpiry(
        reservationReference,
      );

      const expiry = expiryResponse?.expires_at
        ? new Date(expiryResponse.expires_at).getTime()
        : NaN;

      if (!Number.isFinite(expiry)) {
        throw new Error(
          "The new code was requested, but its expiry could not be retrieved. Please refresh and try again.",
        );
      }

      setOtpExpiresAt(expiry);

      setRemainingSeconds(
        Math.max(0, Math.ceil((expiry - Date.now()) / 1000)),
      );

      setStatus({
        loading: false,
        verifying: false,
        resending: false,
        cancelling: false,
        error: "",
        success: "A new verification code has been sent.",
      });
    } catch (error) {
      console.error(
        "Email Verification: Resend failed:",
        error,
      );

      setStatus((previousStatus) => ({
        ...previousStatus,
        resending: false,
        error:
          error.message || "Unable to resend verification code.",
        success: "",
      }));
    }
  };

  /*
   * Open cancellation confirmation modal.
   */
  const handleCancel = () => {
    if (
      !reservationReference ||
      status.cancelling ||
      status.verifying ||
      status.resending
    ) {
      return;
    }

    setStatus((previousStatus) => ({
      ...previousStatus,
      error: "",
      success: "",
    }));

    setIsCancelModalOpen(true);
  };

  /*
   * Confirm reservation cancellation.
   */
  const confirmCancel = async () => {
    if (
      !reservationReference ||
      status.cancelling ||
      status.verifying ||
      status.resending
    ) {
      return;
    }

    setStatus((previousStatus) => ({
      ...previousStatus,
      cancelling: true,
      error: "",
      success: "",
    }));

    try {
      const response = await cancelReservation(
        reservationReference,
      );

      console.log(
        "Email Verification: Reservation cancelled:",
        response,
      );

      setIsCancelModalOpen(false);
      onCancelled();
    } catch (error) {
      console.error(
        "Email Verification: Cancel failed:",
        error,
      );

      setStatus((previousStatus) => ({
        ...previousStatus,
        cancelling: false,
        error:
          error.message || "Unable to cancel the reservation.",
        success: "",
      }));
    }
  };

  return (
    <section
      id="email-verification"
      className="email-verification section"
    >
      <div className="container">
        <div className="section-title">
          <h2>Email Verification</h2>

          <p>
            <span>Verify</span>{" "}
            <span className="description-title">Your Email</span>
          </p>
        </div>

        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="email-verification-card">
              {/* Header */}
              <div className="email-verification-icon">
                <i className="bi bi-envelope-check"> Verify Email</i>

                <h3>Check Your Email</h3>
              </div>

              <p>We have sent a 6-digit verification code to:</p>

              <strong className="verification-email">
                {customerEmail}
              </strong>

              {status.error && !isCancelModalOpen && (
                <div className="verification-error" role="alert">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {status.error}
                </div>
              )}

              {status.success && (
                <div className="verification-success" role="status">
                  <i className="bi bi-check-circle me-2"></i>
                  {status.success}
                </div>
              )}

              {/* OTP Form */}
              <form onSubmit={handleSubmit}>
                <div className="verification-otp-group">
                  <label htmlFor="otp">Enter Verification Code</label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={otp}
                    onChange={handleOtpChange}
                    placeholder="000000"
                    className="form-control verification-otp-input"
                    disabled={
                      isLoadingExpiry ||
                      status.verifying ||
                      status.cancelling ||
                      status.resending ||
                      otpExpiresAt === null ||
                      remainingSeconds <= 0
                    }
                  />
                </div>

                {/* Timer */}
                <div className="verification-timer">
                  <i className="bi bi-clock me-2"></i>

                  {isLoadingExpiry ? (
                    <strong>Loading expiry...</strong>
                  ) : otpExpiresAt === null ? (
                    <strong>
                      Verification expiry unavailable
                    </strong>
                  ) : remainingSeconds > 0 ? (
                    <>
                      Code expires in{" "}
                      <strong>{formatTime()}</strong>
                    </>
                  ) : (
                    <strong>Verification code expired</strong>
                  )}
                </div>

                {/* Verify */}
                <button
                  type="submit"
                  className="btn-get-started form-button"
                  disabled={
                    isLoadingExpiry ||
                    otpExpiresAt === null ||
                    status.verifying ||
                    status.cancelling ||
                    status.resending ||
                    remainingSeconds <= 0 ||
                    otp.length !== 6
                  }
                >
                  {status.verifying ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email
                      <i className="bi bi-check-lg ms-2"></i>
                    </>
                  )}
                </button>
              </form>

              {/* Resend */}
              <div className="verification-resend">
                <span>Didn't receive the code?</span>

                <button
                  type="button"
                  onClick={handleResend}
                  className="verification-resend-button"
                  disabled={
                    isLoadingExpiry ||
                    status.resending ||
                    status.verifying ||
                    status.cancelling
                  }
                >
                  {status.resending ? "Sending..." : "Resend Code"}
                </button>
              </div>

              {/* Cancel */}
              <div className="verification-cancel">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="verification-cancel-button"
                  disabled={
                    status.cancelling ||
                    status.verifying ||
                    status.resending
                  }
                >
                  {status.cancelling ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmActionModal
        isOpen={isCancelModalOpen}
        title="Cancel This Booking?"
        message="Are you sure you want to cancel this reservation and start a new booking? This action cannot be undone."
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        isLoading={status.cancelling}
        error={isCancelModalOpen ? status.error : ""}
        variant="danger"
        onConfirm={confirmCancel}
        onClose={() => {
          if (status.cancelling) return;

          setIsCancelModalOpen(false);

          setStatus((previousStatus) => ({
            ...previousStatus,
            error: "",
          }));
        }}
      />
    </section>
  );
};

export default EmailVerification;
