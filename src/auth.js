const TOKEN_KEY = "rootwatch_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// The API client dispatches this when a request comes back 401 (missing,
// invalid, or expired token) so App.jsx can react by dropping back to the
// login screen — without the client needing to import React/App state
// directly.
export const UNAUTHORIZED_EVENT = "rootwatch:unauthorized";

export function notifyUnauthorized() {
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}
