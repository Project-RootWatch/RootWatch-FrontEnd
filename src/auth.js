const TOKEN_KEY = "rootwatch_token";
const REFRESH_TOKEN_KEY = "rootwatch_refresh_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

// Called after login/signup (pass both) and after a silent refresh (pass
// just the new access token — the refresh token stays whatever it already
// was, since the backend doesn't rotate it on every use).
export function setTokens(accessToken, refreshToken) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// The API client dispatches this when a request comes back 401 and a
// silent token refresh either wasn't possible or itself failed, so
// App.jsx can react by dropping back to the login screen — without the
// client needing to import React/App state directly.
export const UNAUTHORIZED_EVENT = "rootwatch:unauthorized";

export function notifyUnauthorized() {
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
}
