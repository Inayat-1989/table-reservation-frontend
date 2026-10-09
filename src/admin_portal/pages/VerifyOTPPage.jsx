import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function VerifyOTPPage() {
  const navigate = useNavigate();
  const { challengeToken, verifyOTP, isAuthenticated, isLoading } =
    useAdminAuth();

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return <p>Checking admin session...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/admin_portal" replace />;
  }

  if (!challengeToken) {
    return <Navigate to="/admin_portal/login" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await verifyOTP(otp);
      navigate("/admin_portal", { replace: true });
    } catch (error) {
      setError(
        error.message || "Verification failed. Check the code and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="admin-auth-page">
      <section className="admin-auth-card">
        <h1>Verify Your Email</h1>
        <p>
          Enter the six-digit verification code sent to your registered email
          address.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">Verification code</label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
            />
          </div>

          {error && (
            <p className="admin-form-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={isSubmitting || otp.length !== 6}>
            {isSubmitting ? "Verifying..." : "Verify and Continue"}
          </button>
        </form>
      </section>
    </main>
  );
}
