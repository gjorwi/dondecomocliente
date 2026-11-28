"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
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

function BusinessAdCard({ promotion }) {
  return (
    <Link
      href={`/local/${promotion.businessId}`}
      className="group relative flex min-h-[112px] w-[86vw] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-[20px] bg-ink shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg sm:w-[420px]"
    >
      {promotion.coverImage ? (
        <Image
          src={promotion.coverImage}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 640px) 86vw, 420px"
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-accent to-[#8f2f0b]"
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/20"
      />
      <div className="relative z-10 flex w-full items-center gap-3 p-3 text-white">
        <span className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/80 bg-white/15 text-[22px]">
          {promotion.logoImage ? (
            <Image
              src={promotion.logoImage}
              alt={`Logo de ${promotion.businessName}`}
              width={48}
              height={48}
              unoptimized
              className="h-full w-full object-cover"
            />
          ) : (
            promotion.emoji
          )}
        </span>
        <div className="min-w-0 flex-1">
          <span className="inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-white">
            {promotion.badge}
          </span>
          <h3 className="mt-1 truncate font-display text-[18px] leading-tight tracking-[-0.03em] text-white">
            {promotion.title}
          </h3>
          <p className="truncate text-[11px] text-white/75">
            {promotion.note || promotion.businessName}
          </p>
        </div>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-white transition group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </div>
    </Link>
  );
}

export function PromoCarousel({ promotions, loading = false }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [paused, setPaused] = useState(false);
  const promotionCount = promotions.length;

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

  useEffect(() => {
    if (loading || paused || !promotionCount) return undefined;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      const track = trackRef.current;
      if (!track || document.hidden) return;

      const firstCard = track.firstElementChild;
      const cardWidth = firstCard
        ? firstCard.getBoundingClientRect().width + 12
        : track.clientWidth * 0.8;
      const atEnd =
        track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;

      track.scrollTo({
        left: atEnd ? 0 : track.scrollLeft + cardWidth,
        behavior: "smooth",
      });
    }, 5000);

    return () => window.clearInterval(interval);
  }, [loading, paused, promotionCount]);

  return (
    <section
      className="relative mt-5"
      aria-roledescription="carrusel"
      aria-label="Promociones destacadas"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="no-scrollbar -mx-4 flex flex-nowrap snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:px-6"
      >
        {loading
          ? [0, 1].map((index) => <PromoCardSkeleton key={index} />)
          : promotions.map((promotion) =>
              promotion.type === "business" ? (
                <BusinessAdCard key={promotion.id} promotion={promotion} />
              ) : (
                <PromoCard key={promotion.id} promotion={promotion} />
              ),
            )}
        <PlatformPromoCard />
      </div>

      {!loading && promotions.length ? (
        <div className="pointer-events-none absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-2 md:flex">
          <button
            type="button"
            onClick={() => slide(-1)}
            disabled={!canPrev}
            aria-label="Ver promociones anteriores"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-md backdrop-blur transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => slide(1)}
            disabled={!canNext}
            aria-label="Ver más promociones"
            className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white/95 text-ink shadow-md backdrop-blur transition hover:border-accent/40 hover:text-accent disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
