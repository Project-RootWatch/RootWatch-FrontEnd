import { getToken, getRefreshToken, setTokens, clearTokens, notifyUnauthorized } from "../auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Auth endpoints that can themselves return 401 as a normal, expected
// response (wrong password, expired reset link, etc.) — a 401 from one of
// these is never "my session died", so it must never trigger a refresh
// attempt or the unauthorized-logout event.
const NO_REFRESH_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/refresh",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
]);

async function rawRequest(path, options, token) {
  const headers = { ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => null);
  return { response, body };
}

// Shared across concurrent callers so that if several requests hit a 401
// at the same moment (e.g. the dashboard's polling requests all firing
// around the same time), they trigger exactly one /refresh call instead
// of a stampede of them.
let refreshPromise = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token");
      }
      const { response, body } = await rawRequest("/api/auth/refresh", { method: "POST" }, refreshToken);
      if (!response.ok) {
        throw new Error(body?.error ?? "Session expired");
      }
      setTokens(body.access_token);
      return body.access_token;
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function request(path, options = {}, _retrying = false) {
  const { response, body } = await rawRequest(path, options, getToken());

  if (response.status === 401 && !_retrying && !NO_REFRESH_PATHS.has(path) && getRefreshToken()) {
    try {
      await refreshAccessToken();
      return request(path, options, true);
    } catch {
      clearTokens();
      notifyUnauthorized();
      throw new Error("Session expired, please log in again");
    }
  }

  if (response.status === 401 && !NO_REFRESH_PATHS.has(path)) {
    clearTokens();
    notifyUnauthorized();
  }

  if (!response.ok) {
    const message = body?.error ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
}

export function signup(email, password) {
  return request("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function login(email, password) {
  return request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
}

export function getCurrentUser() {
  return request("/api/auth/me");
}

export function forgotPassword(email) {
  return request("/api/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token, password) {
  return request("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
}

export function getCurrentReading() {
  return request("/api/readings/current");
}

export function getReadingHistory(limit = 100) {
  return request(`/api/readings/history?limit=${limit}`);
}

export function postAdvisory() {
  return request("/api/advisory", { method: "POST" });
}

export function postPlantHealth(file) {
  const formData = new FormData();
  formData.append("photo", file);
  // No Content-Type header here on purpose — the browser sets the
  // multipart boundary itself; setting it manually breaks the upload.
  return request("/api/plant-health", { method: "POST", body: formData });
}

export function getPlantHealthHistory(limit = 10) {
  return request(`/api/plant-health/history?limit=${limit}`);
}

export function getActivity(limit = 20) {
  return request(`/api/activity?limit=${limit}`);
}

export function postIrrigationTrigger(durationSeconds) {
  return request("/api/irrigation/trigger", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ duration_seconds: durationSeconds }),
  });
}

export function getIrrigationStatus() {
  return request("/api/irrigation/status");
}

export function getForecast() {
  return request("/api/forecast");
}
