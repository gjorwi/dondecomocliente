"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, Store } from "lucide-react";
import { PromoCard } from "@/components/ui";

function PromoCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex w-[86vw] max-w-[420px] shrink-0 animate-pulse snap-start items-center gap-3 rounded-[20px] border border-line/70 bg-white/60 p-3 shadow-sm sm:w-[420px]"
    >
      <span className="h-14 w-14 shrink-0 rounded-2xl bg-beige/80" />
      <span className="min-w-0 flex-1 space-y-2">
        <span className="block h-3 w-3/4 rounded-full bg-beige/80" />
        <span className="block h-3 w-1/2 rounded-full bg-beige/60" />
      </span>
      <span className="h-5 w-14 shrink-0 rounded-full bg-beige/80" />
    </div>
  );
}

function PlatformPromoCard() {
  return (
    <Link
      href="/solicitud-negocio"
      className="group relative flex w-[86vw] max-w-[420px] shrink-0 snap-start flex-col overflow-hidden rounded-[20px] bg-ink p-4 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:w-[420px]"
    >
      <span className="pointer-events-none absolute -right-5 -top-8 text-[110px] leading-none opacity-10">
        🍽️
      </span>
      <div className="relative z-10">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
            Gratis para negocios
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Store className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>
        <h3 className="mt-2 font-display text-[20px] leading-[1.1] tracking-[-0.03em]">
          Tu negocio, en comidasTop
        </h3>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-mustard">
          Registrar mi negocio
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function PromoCarousel({ promotions, loading = false }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanPrev(track.scrollLeft > 4);
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    updateArrows();
    track.addEventListener("scroll", updateArrows, { passive: true });

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(updateArrows);
    resizeObserver?.observe(track);

    return () => {
      track.removeEventListener("scroll", updateArrows);
      resizeObserver?.disconnect();
    };
  }, [updateArrows]);

  const slide = (direction) => {
    const track = trackRef.current;
    if (!track) return;

    const firstCard = track.firstElementChild;
    const cardWidth = firstCard
      ? firstCard.getBoundingClientRect().width + 12
      : track.clientWidth * 0.8;

    track.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  return (
    <section aria-roledescription="carrusel" aria-label="Promociones destacadas">
      <div className="mb-3 mt-8 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-[24px] leading-tight tracking-[-0.03em] text-ink">
            Promociones destacadas
          </h2>
          <p className="mt-1 text-sm leading-5 text-muted">
            Ofertas de hoy en Coro. Desliza para ver más.
          </p>
        </div>

        {!loading && promotions.length ? (
        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            onClick={() => slide(-1)}
            disabled={!canPrev}
            aria-label="Ver promociones anteriores"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            disabled={!canNext}
            aria-label="Ver más promociones"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        ) : null}
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex flex-nowrap snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        <PlatformPromoCard />
        {loading
          ? [0, 1].map((index) => <PromoCardSkeleton key={index} />)
          : promotions.map((promotion) => (
              <PromoCard key={promotion.id} promotion={promotion} />
            ))}
      </div>
    </section>
  );
}
