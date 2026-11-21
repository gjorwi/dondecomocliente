import Link from "next/link";
import { ArrowRight, ScanLine } from "lucide-react";
import { BackLink, Pill } from "@/components/ui";

export const metadata = {
  title: "Escanear · comidasTop",
  description:
    "Escanea el código QR del local para abrir su menú, promociones y Top 3.",
};

export default function ScanPage() {
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
        Abre el menú, las promociones y el Top 3 del lugar donde estás.
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
        <Pill tone="amber">Cámara simulada</Pill>
        <h2 className="mt-2 font-display text-xl tracking-[-0.03em] text-ink">
          ¿Probando la demo?
        </h2>
        <p className="mt-1.5 text-sm leading-6 text-muted">
          Abre un local de ejemplo con su menú, ofertas y puntuaciones.
        </p>
        <Link
          href="/local/la-doble-de-tito"
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-[#b33a0d]"
        >
          Abrir local de ejemplo
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
