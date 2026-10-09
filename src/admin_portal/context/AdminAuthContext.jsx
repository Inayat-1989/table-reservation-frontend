import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Adjust this import path to your existing API client.
import { apiRequest, initializeCsrf } from "../../api/client";

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const location = useLocation();

  const [admin, setAdmin] = useState(null);
  const [challengeToken, setChallengeToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!location.pathname.startsWith("/admin_portal")) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        await initializeCsrf();

        const response = await apiRequest("/admin/me/");

        if (!cancelled) {
          setAdmin(response.admin ?? response);
          setIsAuthenticated(true);
        }
        // eslint-disable-next-line no-unused-vars
      } catch (error) {
        if (!cancelled) {
          setAdmin(null);
          setIsAuthenticated(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, [location.pathname]);

  async function login(identifier, password) {
    await initializeCsrf();

    const response = await apiRequest("/admin/login/", {
      method: "POST",
      body: JSON.stringify({
        identifier,
        password,
      }),
    });

    setChallengeToken(response.challenge_token);

    return response;
  }

  async function verifyOTP(otp) {
    if (!challengeToken) {
      throw new Error(
        "Your login challenge has expired. Please sign in again.",
      );
    }

    const response = await apiRequest("/admin/2fa/verify/", {
      method: "POST",
      body: JSON.stringify({
        challenge_token: challengeToken,
        otp,
      }),
    });

    setAdmin(response.admin ?? null);
    setIsAuthenticated(true);
    setChallengeToken(null);

    return response;
  }

  async function logout() {
    try {
      await apiRequest("/admin/logout/", {
        method: "POST",
      });
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
      setChallengeToken(null);
    }
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated,
        challengeToken,
        login,
        verifyOTP,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider.");
  }

  return context;
}
