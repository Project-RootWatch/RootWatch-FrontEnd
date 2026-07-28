const BASE_URL = import.meta.env.VITE_API_BASE_URL;

async function request(path, options) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    const message = body?.error ?? `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
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
