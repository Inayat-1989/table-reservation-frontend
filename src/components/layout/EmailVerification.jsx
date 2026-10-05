import { useEffect, useState } from "react";

import {
  cancelReservation,
  resendReservationOtp,
  verifyReservationOtp,
} from "../../api/reservationApi";

import "../../assets/css/MenuSelection.css";

const VERIFICATION_DURATION = 15 * 60;

const EmailVerification = ({ booking, onVerified, onCancelled }) => {
  const [otp, setOtp] = useState("");
  const [remainingSeconds, setRemainingSeconds] = useState(
    VERIFICATION_DURATION,
  );

  const [status, setStatus] = useState({
    loading: false,
    verifying: false,
    resending: false,
    cancelling: false,
    error: "",
    success: "",
  });

  const reservationReference =
    booking?.reference_code;

  const customerEmail =
    booking?.customer_email;

  /*
   * The OTP should already have been generated and
   * sent when the DRAFT was finalized.
   *
   * Therefore this component does NOT automatically
   * send another OTP when it mounts.
   */

  useEffect(() => {
    setOtp("");
    setRemainingSeconds(VERIFICATION_DURATION);

    setStatus({
      loading: false,
      verifying: false,
      resending: false,
      cancelling: false,
      error: "",
      success: "",
    });
  }, [reservationReference]);

  /*
   * Countdown.
   */
  useEffect(() => {
    if (
      status.loading ||
      remainingSeconds <= 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds(
        (previousSeconds) => {
          if (previousSeconds <= 1) {
            clearInterval(timer);
            return 0;
          }

          return previousSeconds - 1;
        },
      );
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    status.loading,
    remainingSeconds,
  ]);

  const formatTime = () => {
    const minutes = Math.floor(
      remainingSeconds / 60,
    );

    const seconds =
      remainingSeconds % 60;

    return `${String(minutes).padStart(
      2,
      "0",
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const handleOtpChange = (event) => {
    const value =
      event.target.value.replace(/\D/g, "");

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
        error:
          "Reservation information is missing.",
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
        error:
          "Please enter the 6-digit verification code.",
      }));

      return;
    }

    try {
      setStatus((previousStatus) => ({
        ...previousStatus,
        verifying: true,
        error: "",
      }));

      const reservation =
        await verifyReservationOtp(
          reservationReference,
          otp,
        );

      console.log(
        "Email Verification : Confirmed Reservation:",
        reservation,
      );

      setStatus({
        loading: false,
        verifying: false,
        resending: false,
        cancelling: false,
        error: "",
        success:
          "Email verified successfully.",
      });

      /*
       * Django has already changed the
       * reservation to CONFIRMED.
       */
      onVerified(reservation);
    } catch (error) {
      console.error(
        "Email Verification : OTP verification failed:",
        error,
      );

      setStatus((previousStatus) => ({
        ...previousStatus,
        verifying: false,
        error:
          error.message ||
          "Unable to verify the code.",
        success: "",
      }));
    }
  };

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
      await resendReservationOtp(
        reservationReference,
      );

      setRemainingSeconds(
        VERIFICATION_DURATION,
      );

      setStatus({
        loading: false,
        verifying: false,
        resending: false,
        cancelling: false,
        error: "",
        success:
          "A new verification code has been sent.",
      });
    } catch (error) {
      console.error(
        "Email Verification : Resend failed:",
        error,
      );

      setStatus({
        loading: false,
        verifying: false,
        resending: false,
        cancelling: false,
        error:
          error.message ||
          "Unable to resend verification code.",
        success: "",
      });
    }
  };

  /*
   * Cancel reservation.
   */
  const handleCancel = async () => {
    if (
      !reservationReference ||
      status.cancelling ||
      status.verifying ||
      status.resending
    ) {
      return;
    }

    const shouldCancel = window.confirm(
      "Are you sure you want to cancel this reservation and start a new booking?",
    );

    if (!shouldCancel) {
      return;
    }

    setStatus({
      loading: false,
      verifying: false,
      resending: false,
      cancelling: true,
      error: "",
      success: "",
    });

    try {
      const response =
        await cancelReservation(
          reservationReference,
        );

      console.log(
        "Email Verification : Reservation cancelled:",
        response,
      );

      onCancelled();
    } catch (error) {
      console.error(
        "Email Verification : Cancel failed:",
        error,
      );

      setStatus({
        loading: false,
        verifying: false,
        resending: false,
        cancelling: false,
        error:
          error.message ||
          "Unable to cancel the reservation.",
        success: "",
      });
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
            <span className="description-title">
              Your Email
            </span>
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

              <p>
                We have sent a 6-digit
                verification code to:
              </p>

              <strong className="verification-email">
                {customerEmail}
              </strong>

              {/* Error */}
              {status.error && (
                <div
                  className="verification-error"
                  role="alert"
                >
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {status.error}
                </div>
              )}

              {/* Success */}
              {status.success && (
                <div
                  className="verification-success"
                  role="status"
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {status.success}
                </div>
              )}

              {/* OTP Form */}
              <form onSubmit={handleSubmit}>
                <div className="verification-otp-group">
                  <label htmlFor="otp">
                    Enter Verification Code
                  </label>

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
                      status.verifying ||
                      status.cancelling ||
                      remainingSeconds <= 0
                    }
                  />
                </div>

                {/* Timer */}
                <div className="verification-timer">
                  <i className="bi bi-clock me-2"></i>

                  {remainingSeconds > 0 ? (
                    <>
                      Code expires in{" "}
                      <strong>
                        {formatTime()}
                      </strong>
                    </>
                  ) : (
                    <strong>
                      Verification code expired
                    </strong>
                  )}
                </div>

                {/* Verify */}
                <button
                  type="submit"
                  className="btn-get-started form-button"
                  disabled={
                    status.verifying ||
                    status.cancelling ||
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
                <span>
                  Didn't receive the code?
                </span>

                <button
                  type="button"
                  onClick={handleResend}
                  className="verification-resend-button"
                  disabled={
                    status.resending ||
                    status.verifying ||
                    status.cancelling
                  }
                >
                  {status.resending
                    ? "Sending..."
                    : "Resend Code"}
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
    </section>
  );
};

export default EmailVerification;