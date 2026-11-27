"use client";

import Link from "next/link";
import { ArrowRight, Gift } from "lucide-react";

export function HomeCoupons() {
  return (
    <section className="mt-8 flex items-center gap-3 rounded-[24px] bg-white p-4 shadow-sm sm:gap-4 sm:p-5">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-tint text-open sm:h-12 sm:w-12">
        <Gift className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
          Beneficios
        </p>
        <h2 className="truncate font-display text-[22px] leading-tight tracking-[-0.03em] text-ink sm:text-[24px]">
          Cupones para ti
        </h2>
      </div>
      <Link
        href="/cupones"
        className="inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-accent px-4 text-xs font-semibold text-white transition hover:bg-[#b33a0d] sm:px-5 sm:text-sm"
      >
        Ver cupones
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
