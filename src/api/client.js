import { getToken, clearToken, notifyUnauthorized } from "../auth";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const body = await response.json().catch(() => null);

  if (response.status === 401) {
    clearToken();
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
