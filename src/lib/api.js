const API_PATH = "/api";

const DEVICE_KEY = "dondecomo:device";
const TOKEN_KEY = "dondecomo:client-token";
const TOKEN_EVENT = "dondecomo:client-token";

export function getToken() {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(TOKEN_KEY) || "";
  } catch {
    return "";
  }
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(TOKEN_EVENT));
}

export async function apiFetch(path, options = {}) {
  const token = getToken();
  const response = await fetch(`${API_PATH}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    if (response.status === 401) setToken("");
    throw new Error(payload.message || "No se pudo completar la solicitud.");
  }
  return payload;
}

export function getDeviceId() {
  if (typeof window === "undefined") return "";
  try {
    const existing = window.localStorage.getItem(DEVICE_KEY);
    if (existing) return existing;
    const next =
      window.crypto?.randomUUID?.() ||
      `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(DEVICE_KEY, next);
    return next;
  } catch {
    return `device-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export async function submitRating(productId, score, visitId) {
  const deviceId = getDeviceId();
  return apiFetch("/ratings", {
    method: "POST",
    body: JSON.stringify({ productId, deviceId, score, visitId }),
  });
}

export async function registerScan(businessId, location) {
  const deviceId = getDeviceId();
  return apiFetch(`/businesses/${businessId}/scan`, {
    method: "POST",
    body: JSON.stringify({ deviceId, location }),
  });
}

export async function fetchScanStatus(businessId) {
  const deviceId = getDeviceId();
  return apiFetch(
    `/businesses/${businessId}/scan?deviceId=${encodeURIComponent(deviceId)}`,
  );
}

export async function submitBusinessRequest(data) {
  return apiFetch("/business-requests", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function trackBusinessEvent(businessId, type, extra = {}) {
  if (typeof window === "undefined" || !businessId || !type) return;

  const token = getToken();
  try {
    fetch(`${API_PATH}/businesses/${encodeURIComponent(businessId)}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        type,
        deviceId: getDeviceId(),
        ...extra,
      }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Las métricas no deben bloquear la navegación.
  }
}

export { TOKEN_EVENT };
