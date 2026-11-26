"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Loader2, Star } from "lucide-react";
import { useClientAuth } from "@/components/auth-provider";
import { fetchScanStatus } from "@/lib/api";
import {
  clearScanSession,
  getScanSnapshot,
  parseScanSession,
  subscribeToScan,
  updateScanSessionVotes,
} from "@/lib/scan-session";

export function PendingVoteButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useClientAuth();
  const raw = useSyncExternalStore(
    subscribeToScan,
    getScanSnapshot,
    () => "",
  );
  const session = useMemo(() => parseScanSession(raw), [raw]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  if (!session || session.votesRemaining <= 0) return null;
  if (pathname === `/escanear/${session.businessId}`) return null;

  const openVoting = async () => {
    if (busy) return;

    if (!user) {
      router.push(
        `/login?next=${encodeURIComponent(`/escanear/${session.businessId}`)}`,
      );
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const payload = await fetchScanStatus(session.businessId);
      if (!payload.visit || payload.visit.votesRemaining <= 0) {
        clearScanSession();
        return;
      }

      updateScanSessionVotes(
        session.businessId,
        payload.visit.votesRemaining,
      );
      router.push(`/escanear/${session.businessId}`);
    } catch (error) {
      setMessage(
        error.message || "No pudimos verificar tu votación pendiente.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] right-4 z-40 max-w-[calc(100vw-2rem)] md:bottom-6 md:right-6">
      <button
        type="button"
        onClick={openVoting}
        disabled={busy}
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
          {session.votesRemaining}{" "}
          {session.votesRemaining === 1 ? "voto" : "votos"}
        </span>
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </button>
      {message ? (
        <p className="mt-1 rounded-xl bg-white px-3 py-2 text-[11px] leading-4 text-accent shadow-sm">
          {message}
        </p>
      ) : null}
    </div>
  );
}
