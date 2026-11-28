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
        <h2 className="font-display text-[20px] leading-tight tracking-[-0.03em] text-ink sm:text-[24px]">
          Cupones para ti
        </h2>
      </div>
      <Link
        href="/cupones"
        aria-label="Ver cupones"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-white transition hover:bg-[#b33a0d]"
      >
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
