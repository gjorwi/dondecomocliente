const API_PATH = "/api";

const DEVICE_KEY = "dondecomo:device";

export async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_PATH}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
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
