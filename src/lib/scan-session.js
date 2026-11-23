const SCAN_STORAGE_KEY = "comidasTop:scan";
const SCAN_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const DEFAULT_MAX_VOTES = 2;

function persist(session) {
  try {
    window.sessionStorage.setItem(SCAN_STORAGE_KEY, JSON.stringify(session));
  } catch {
    // Si el almacenamiento no está disponible, la pantalla de puntuación
    // mostrará el aviso de escaneo requerido.
  }
}

export function saveScanSession(businessId, visit = null) {
  if (typeof window === "undefined" || !businessId) return;

  const scannedAt = Date.now();
  const expiresAt = visit?.expiresAt
    ? new Date(visit.expiresAt).getTime()
    : scannedAt + SCAN_MAX_AGE_MS;
  const maxVotes = Number(visit?.maxVotes) || DEFAULT_MAX_VOTES;
  const votesUsed = Number(visit?.votesUsed) || 0;

  persist({
    businessId,
    scannedAt,
    visitId: visit?.id || null,
    maxVotes,
    votesUsed,
    votesRemaining:
      typeof visit?.votesRemaining === "number"
        ? visit.votesRemaining
        : Math.max(0, maxVotes - votesUsed),
    expiresAt,
  });
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

    const expiresAt =
      typeof parsed.expiresAt === "number"
        ? parsed.expiresAt
        : parsed.scannedAt + SCAN_MAX_AGE_MS;

    if (Date.now() > expiresAt) {
      window.sessionStorage.removeItem(SCAN_STORAGE_KEY);
      return null;
    }

    return {
      ...parsed,
      expiresAt,
      maxVotes: Number(parsed.maxVotes) || DEFAULT_MAX_VOTES,
      votesRemaining:
        typeof parsed.votesRemaining === "number"
          ? parsed.votesRemaining
          : DEFAULT_MAX_VOTES,
    };
  } catch {
    return null;
  }
}

export function updateScanSessionVotes(businessId, votesRemaining) {
  const session = readScanSession();
  if (!session || session.businessId !== businessId) return;

  const maxVotes = session.maxVotes || DEFAULT_MAX_VOTES;
  const remaining = Math.max(0, Number(votesRemaining) || 0);
  persist({
    ...session,
    votesRemaining: remaining,
    votesUsed: Math.max(0, maxVotes - remaining),
  });
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
