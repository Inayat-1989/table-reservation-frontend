const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ??
    "http://127.0.0.1:8000/api/v1";

const getCsrfToken = () => {
    const csrfCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("csrftoken="));

    return csrfCookie
        ? decodeURIComponent(csrfCookie.split("=")[1])
        : null;
};

export async function apiRequest(endpoint, options = {}) {
    const method = options.method?.toUpperCase() ?? "GET";

    const csrfToken = getCsrfToken();

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            method,
            credentials: "include",
            headers: {
                ...(options.body instanceof FormData
                    ? {}
                    : options.body
                      ? {
                          "Content-Type":
                              "application/json",
                        }
                      : {}),

                ...(csrfToken &&
                !["GET", "HEAD", "OPTIONS"].includes(method)
                    ? {
                          "X-CSRFToken": csrfToken,
                      }
                    : {}),

                ...options.headers,
            },
        },
    );

    const contentType =
        response.headers.get("content-type") ?? "";

    const data = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok) {
        const error = new Error(
            data?.detail ??
                "The request could not be completed.",
        );

        error.status = response.status;
        error.code = data?.code ?? "API_ERROR";
        error.data = data;

        throw error;
    }

    return data;
}

export async function initializeCsrf() {
    await fetch(`${API_BASE_URL}/csrf/`, {
        method: "GET",
        credentials: "include",
    });
}