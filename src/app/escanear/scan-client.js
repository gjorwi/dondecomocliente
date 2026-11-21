"use client";

import { useRouter } from "next/navigation";
import { ScanLine, ScanQrCode } from "lucide-react";
import { BackLink, Pill } from "@/components/ui";
import { useBusinesses } from "@/lib/hooks";
import { saveScanSession } from "@/lib/scan-session";

export default function ScanClient() {
  const router = useRouter();
  const { businesses } = useBusinesses();
  const demoBusinesses = businesses.slice(0, 6);

  const simulateScan = (businessId) => {
    saveScanSession(businessId);
    router.push(`/escanear/${businessId}`);
  };

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/" />

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Escáner
      </p>
      <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
        Escanea el QR del local
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        El escaneo es la única forma de puntuar los platos del establecimiento.
      </p>

      <section className="mt-6 overflow-hidden rounded-[32px] bg-ink px-5 py-8">
        <div className="relative mx-auto flex aspect-square w-full max-w-[280px] items-center justify-center rounded-[28px] border border-white/15 bg-white/5">
          <span className="absolute left-4 top-4 h-9 w-9 rounded-tl-xl border-l-[3px] border-t-[3px] border-mustard" />
          <span className="absolute right-4 top-4 h-9 w-9 rounded-tr-xl border-r-[3px] border-t-[3px] border-mustard" />
          <span className="absolute bottom-4 left-4 h-9 w-9 rounded-bl-xl border-b-[3px] border-l-[3px] border-mustard" />
          <span className="absolute bottom-4 right-4 h-9 w-9 rounded-br-xl border-b-[3px] border-r-[3px] border-mustard" />
          <ScanLine className="h-12 w-12 text-white/25" aria-hidden="true" />
          <span className="scan-line absolute inset-x-8 top-1/2 h-0.5 rounded-full bg-accent shadow-[0_0_16px_#c9410f]" />
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs font-semibold text-white/70">
          <span className="h-2 w-2 rounded-full bg-open" />
          Apunta la cámara al código de la mesa
        </div>
      </section>

      <section className="mt-4 rounded-[24px] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <Pill tone="amber">Cámara simulada</Pill>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Demo
          </span>
        </div>
        <h2 className="mt-2 font-display text-xl tracking-[-0.03em] text-ink">
          Elige un local para simular el QR
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-muted">
          Al seleccionarlo se abre la pantalla de puntuación de su menú.
        </p>

        {demoBusinesses.length ? (
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {demoBusinesses.map((business) => (
              <button
                key={business.id}
                type="button"
                onClick={() => simulateScan(business.id)}
                aria-label={`Simular escaneo del QR de ${business.name}`}
                className="group flex items-center gap-3 rounded-2xl border border-line bg-soft p-3 text-left transition hover:border-accent/40 hover:bg-white"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-tint text-[24px]">
                  {business.emoji || "🍽️"}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {business.name}
                  </span>
                  <span className="block text-[11px] text-muted">
                    {business.zone} · Coro
                  </span>
                </span>
                <ScanQrCode
                  className="h-5 w-5 shrink-0 text-muted transition group-hover:text-accent"
                  aria-hidden="true"
                />
              </button>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl bg-soft p-4 text-sm text-muted">
            No hay locales de demostración disponibles ahora.
          </p>
        )}

        <p className="mt-4 text-[10px] leading-4 text-[#8a5a00]">
          La puntuación solo se habilita después de este escaneo simulado.
        </p>
      </section>
    </div>
  );
}
