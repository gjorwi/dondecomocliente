const SCAN_STORAGE_KEY = "comidasTop:scan";
const SCAN_MAX_AGE_MS = 2 * 60 * 60 * 1000;

export function saveScanSession(businessId) {
  if (typeof window === "undefined" || !businessId) return;

  try {
    window.sessionStorage.setItem(
      SCAN_STORAGE_KEY,
      JSON.stringify({ businessId, scannedAt: Date.now() }),
    );
  } catch {
    // Si el almacenamiento no está disponible, la pantalla de puntuación
    // mostrará el aviso de escaneo requerido.
  }
}

export function readScanSession() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.sessionStorage.getItem(SCAN_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed?.businessId || typeof parsed.scannedAt !== "number") {
      return null;
    }

    if (Date.now() - parsed.scannedAt > SCAN_MAX_AGE_MS) {
      window.sessionStorage.removeItem(SCAN_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function hasValidScanFor(businessId) {
  const session = readScanSession();
  return Boolean(session && session.businessId === businessId);
}

export function clearScanSession() {
  if (typeof window === "undefined") return;

  try {
    window.sessionStorage.removeItem(SCAN_STORAGE_KEY);
  } catch {
    // Sin acción: no hay nada que limpiar si el almacenamiento falla.
  }
}
