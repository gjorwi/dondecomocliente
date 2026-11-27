"use client";

import {
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowRight, Loader2, Star } from "lucide-react";
import { useClientAuth } from "@/components/auth-provider";
import {
  apiFetch,
  fetchScanStatus,
  finishVisit,
  getDeviceId,
} from "@/lib/api";
import {
  SCAN_EVENT,
  clearScanSession,
  getScanSnapshot,
  parseScanSession,
  saveScanSession,
  subscribeToScan,
} from "@/lib/scan-session";

export function PendingVoteButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useClientAuth();
  const deviceId = useMemo(() => getDeviceId(), []);
  const raw = useSyncExternalStore(
    subscribeToScan,
    getScanSnapshot,
    () => "",
  );
  const localSession = useMemo(() => parseScanSession(raw), [raw]);
  const pendingKey = user
    ? `/auth/me/pending-votes?deviceId=${encodeURIComponent(deviceId)}`
    : null;
  const { data: pendingData, mutate: mutatePending } = useSWR(
    pendingKey,
    apiFetch,
    { revalidateOnFocus: false },
  );
  const serverPending = pendingData?.pending || null;
  const pending = useMemo(() => {
    if (serverPending) {
      return {
        businessId: serverPending.businessId,
        businessName: serverPending.businessName,
        visitId: serverPending.visitId,
        votesRemaining: serverPending.votesRemaining,
        maxVotes: serverPending.maxVotes,
        votesUsed: serverPending.votesUsed,
        expiresAt: new Date(serverPending.expiresAt).getTime(),
        source: "server",
      };
    }
    if (localSession) return { ...localSession, source: "local" };
    return null;
  }, [localSession, serverPending]);
  const [busy, setBusy] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!pendingKey) return undefined;
    const refresh = () => mutatePending();
    window.addEventListener(SCAN_EVENT, refresh);
    return () => window.removeEventListener(SCAN_EVENT, refresh);
  }, [mutatePending, pendingKey]);

  if (!pending || pending.votesRemaining <= 0) return null;
  if (pathname === `/escanear/${pending.businessId}`) return null;

  const openVoting = async () => {
    if (busy) return;

    if (!user) {
      if (pending.source === "server") {
        saveScanSession(pending.businessId, {
          id: pending.visitId,
          votesRemaining: pending.votesRemaining,
          maxVotes: pending.maxVotes,
          votesUsed: pending.votesUsed,
          expiresAt: new Date(pending.expiresAt).toISOString(),
        });
      }
      router.push(
        `/login?next=${encodeURIComponent(`/escanear/${pending.businessId}`)}`,
      );
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const payload = await fetchScanStatus(pending.businessId);
      if (!payload.visit || payload.visit.votesRemaining <= 0) {
        clearScanSession();
        await mutatePending();
        return;
      }

      saveScanSession(pending.businessId, payload.visit);
      await mutatePending();
      router.push(`/escanear/${pending.businessId}`);
    } catch (error) {
      setMessage(
        error.message || "No pudimos verificar tu votación pendiente.",
      );
    } finally {
      setBusy(false);
    }
  };

  const finishVoting = async () => {
    if (busy || finishing || !user) return;
    const confirmed = window.confirm(
      "¿Terminar esta votación? No podrás puntuar más platos en este local durante las próximas 24 horas.",
    );
    if (!confirmed) return;

    setFinishing(true);
    setMessage("");
    try {
      await finishVisit(pending.visitId);
      clearScanSession();
      await mutatePending();
    } catch (error) {
      setMessage(
        error.message || "No pudimos terminar la votación pendiente.",
      );
    } finally {
      setFinishing(false);
    }
  };

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-4 z-40 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-1.5 md:bottom-6 md:right-6">
      <button
        type="button"
        onClick={openVoting}
        disabled={busy}
        title={
          pending.businessName
            ? `Votación pendiente en ${pending.businessName}`
            : "Votación pendiente"
        }
        className="flex min-h-12 max-w-full items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white shadow-lg ring-1 ring-white/10 transition hover:bg-ink/90 disabled:cursor-wait disabled:opacity-70"
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin text-mustard" aria-hidden="true" />
        ) : (
          <Star
            className="h-4 w-4 shrink-0 fill-mustard text-mustard"
            aria-hidden="true"
          />
        )}
        <span className="truncate">Votación pendiente</span>
        <span className="shrink-0 rounded-full bg-white/15 px-2 py-0.5 text-[11px]">
          {pending.votesRemaining}{" "}
          {pending.votesRemaining === 1 ? "voto" : "votos"}
        </span>
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </button>
      {user ? (
        <button
          type="button"
          onClick={finishVoting}
          disabled={finishing}
          className="inline-flex min-h-8 items-center rounded-full bg-white px-3 text-[11px] font-semibold text-muted shadow-md ring-1 ring-line transition hover:text-accent disabled:cursor-wait disabled:opacity-70"
        >
          {finishing ? "Terminando…" : "Terminar votación"}
        </button>
      ) : null}
      {message ? (
        <p className="mt-1 rounded-xl bg-white px-3 py-2 text-[11px] leading-4 text-accent shadow-sm">
          {message}
        </p>
      ) : null}
    </div>
  );
}
