"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PromoCard } from "@/components/ui";

export function PromoCarousel({ promotions }) {
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
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex flex-nowrap snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {promotions.map((promotion) => (
          <PromoCard key={promotion.id} promotion={promotion} />
        ))}
      </div>
    </section>
  );
}
