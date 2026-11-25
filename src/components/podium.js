"use client";

import Image from "next/image";
import Link from "next/link";
import { ChefHat, Loader2, Sparkles, Star, Trophy } from "lucide-react";
import { formatScore, getAdjustedProductScore } from "@/lib/scoring";

const POSITIONS = [1, 2, 3];

const COLUMN_STYLES = {
  1: "col-start-2",
  2: "col-start-1",
  3: "col-start-3",
};

const STEP_STYLES = {
  1: "h-28 bg-accent text-white text-4xl sm:h-36 sm:text-5xl",
  2: "h-20 bg-mustard text-ink text-3xl sm:h-24 sm:text-4xl",
  3: "h-16 bg-beige text-ink text-2xl sm:h-20 sm:text-3xl",
};

const EMPTY_STEP_STYLES = {
  1: "h-28 border border-dashed border-accent/30 bg-accent/10 text-accent/40 text-4xl sm:h-36 sm:text-5xl",
  2: "h-20 border border-dashed border-[#c9a227]/40 bg-mustard/15 text-[#8a5a00]/50 text-3xl sm:h-24 sm:text-4xl",
  3: "h-16 border border-dashed border-line bg-beige/60 text-muted/60 text-2xl sm:h-20 sm:text-3xl",
};

const PLATE_STYLES = {
  1: "h-16 w-16 sm:h-20 sm:w-20",
  2: "h-12 w-12 sm:h-16 sm:w-16",
  3: "h-12 w-12 sm:h-16 sm:w-16",
};

const EMOJI_STYLES = {
  1: "text-[30px] sm:text-[38px]",
  2: "text-[24px] sm:text-[30px]",
  3: "text-[24px] sm:text-[30px]",
};

function AudienceSilhouette({ mirrored = false }) {
  return (
    <svg
      viewBox="0 0 240 140"
      aria-hidden="true"
      fill="currentColor"
      className={`pointer-events-none absolute bottom-0 z-0 hidden h-28 w-56 text-[#6b4a2f]/20 lg:block xl:h-36 xl:w-72 ${
        mirrored ? "right-0" : "left-0"
      }`}
    >
      <g transform={mirrored ? "translate(240 0) scale(-1 1)" : undefined}>
        <circle cx="28" cy="78" r="15" />
        <path d="M2 140c0-23 12-39 26-39s26 16 26 39z" />
        <circle cx="82" cy="50" r="22" />
        <path d="M46 140c0-30 16-50 36-50s36 20 36 50z" />
        <circle cx="139" cy="66" r="18" />
        <path d="M108 140c0-26 14-43 31-43s31 17 31 43z" />
        <circle cx="196" cy="80" r="14" />
        <path d="M170 140c0-21 12-35 26-35s26 14 26 35z" />
      </g>
    </svg>
  );
}

function entryData(entry) {
  if (!entry) return null;

  const product = entry.product || entry;
  const business = entry.business || null;
  const score = getAdjustedProductScore(product);
  const ratingsCount = product.ratingsCount ?? 0;
  const businessName =
    business?.name || product.businessName || "Establecimiento";
  const zone =
    business?.sector ||
    business?.parish ||
    business?.municipality ||
    product.businessSector ||
    "Coro";

  return { product, business, score, ratingsCount, businessName, zone };
}

function PodiumEntry({
  entry,
  position,
  demo,
  categoryId,
  categoryImage,
  loading,
}) {
  const data = entryData(entry);

  if (loading) {
    return (
      <div className="flex min-h-[130px] w-full animate-pulse flex-col items-center text-center sm:min-h-[158px]">
        <div className={`rounded-full bg-white/80 ${PLATE_STYLES[position]}`} />
        <div className="mt-2 h-3 w-24 max-w-full rounded-full bg-white/80" />
        <div className="mt-1.5 h-2.5 w-20 max-w-full rounded-full bg-white/60" />
        <div className="mt-1.5 h-2.5 w-14 max-w-full rounded-full bg-white/50" />
      </div>
    );
  }

  if (!data) {
    return (
      <div
        title="Aún no hay otro plato de esta categoría con puntuaciones suficientes."
        className="flex min-h-[130px] w-full min-w-0 flex-col items-center text-center sm:min-h-[158px]"
      >
        <span
          className={`flex items-center justify-center rounded-full border border-dashed border-[#c9a887] bg-white/55 text-[#a98560] ${PLATE_STYLES[position]}`}
        >
          <ChefHat className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
        </span>
        <p className="mt-1.5 text-[11px] font-semibold leading-tight text-[#8a6a48] sm:text-sm">
          Aún sin plato
        </p>
        <p className="mt-0.5 line-clamp-2 w-full text-[10px] leading-tight text-muted sm:text-xs">
          Faltan puntuaciones
        </p>
      </div>
    );
  }

  const href = demo
    ? `/buscar?categoria=${encodeURIComponent(categoryId || "")}`
    : `/plato/${data.product.id}`;

  const content = (
    <>
      <span className="relative inline-flex shrink-0">
        <span
          className={`relative flex items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-line/70 ${PLATE_STYLES[position]}`}
        >
          {data.product.image || categoryImage ? (
            <Image
              src={data.product.image || categoryImage}
              alt=""
              fill
              unoptimized
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <span className={EMOJI_STYLES[position]}>
              {data.product.emoji || "🍽️"}
            </span>
          )}
        </span>
        {position === 1 ? (
          <span className="absolute -right-1 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-mustard text-ink shadow-sm">
            <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </span>

      <span className="mt-1.5 line-clamp-2 w-full text-[11px] font-semibold leading-tight text-ink sm:text-sm">
        {data.product.name}
      </span>
      <span className="mt-0.5 line-clamp-1 w-full text-[10px] leading-tight text-muted sm:text-xs">
        {data.businessName}
        {data.zone ? ` · ${data.zone}` : ""}
      </span>
      <span className="mt-1 inline-flex items-center gap-0.5 text-[10px] font-semibold leading-tight text-ink sm:text-xs">
        <Star
          className="h-3 w-3 fill-mustard text-mustard"
          aria-hidden="true"
        />
        {formatScore(data.score)}
        {data.ratingsCount ? (
          <span className="font-normal text-muted">· {data.ratingsCount}</span>
        ) : null}
      </span>
    </>
  );

  return (
    <div className="flex min-h-[130px] w-full min-w-0 flex-col items-center text-center sm:min-h-[158px]">
      <Link
        href={href}
        aria-label={`${data.product.name}, puesto ${position}`}
        className="group flex w-full flex-col items-center"
      >
        {content}
        <span className="sr-only">Ver más</span>
      </Link>
    </div>
  );
}

export function TopThreePodium({
  entries = [],
  demo = false,
  loading = false,
  categoryId,
  categoryLabel = "",
  categoryImage,
}) {
  const byPosition = new Map(
    entries.map((entry, index) => [entry.position || index + 1, entry]),
  );

  return (
    <div
      aria-busy={loading}
      className="relative overflow-hidden rounded-[32px] border border-line/70 bg-[radial-gradient(circle_at_50%_0%,#fff7e8_0%,#fdf1e2_45%,#f6e8d8_100%)] px-3 py-6 shadow-sm sm:px-6 sm:py-8"
    >
      <Trophy
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute -left-8 top-10 h-28 w-28 rotate-[-18deg] text-accent/[0.06]"
      />
      <Trophy
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute -right-8 top-4 h-28 w-28 rotate-[18deg] text-mustard/20"
      />
      <div className="pointer-events-none absolute left-1/2 top-10 h-44 w-64 -translate-x-1/2 rounded-full bg-mustard/20 blur-3xl" />
      <Sparkles
        aria-hidden="true"
        className="pointer-events-none absolute left-8 top-20 hidden h-5 w-5 text-mustard/70 sm:block"
      />
      <Sparkles
        aria-hidden="true"
        className="pointer-events-none absolute right-10 top-14 hidden h-4 w-4 text-accent/30 sm:block"
      />
      <Star
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 left-10 hidden h-3.5 w-3.5 fill-mustard/40 text-mustard/40 sm:block"
      />
      <Star
        aria-hidden="true"
        className="pointer-events-none absolute bottom-16 right-12 hidden h-3 w-3 fill-accent/20 text-accent/20 sm:block"
      />

      <AudienceSilhouette />
      <AudienceSilhouette mirrored />

      <div className="relative z-10 mx-auto max-w-lg">
        <p className="mb-4 flex items-center justify-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a5a00]">
          <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
          Podio de {categoryLabel || "la categoría"}
          {loading ? (
            <Loader2
              className="h-3 w-3 animate-spin"
              aria-hidden="true"
            />
          ) : null}
        </p>

        <ol
          className="grid grid-cols-3 items-end gap-2 sm:gap-3"
          aria-label={
            categoryLabel
              ? `Top 3 de ${categoryLabel} en Coro`
              : "Top 3 en Coro"
          }
        >
          {POSITIONS.map((position) => {
            const entry = byPosition.get(position);

            return (
              <li
                key={position}
                className={`${COLUMN_STYLES[position]} row-start-1 flex min-w-0 flex-col items-center`}
              >
                <PodiumEntry
                  entry={entry}
                  position={position}
                  demo={demo}
                  categoryId={categoryId}
                  categoryImage={categoryImage}
                  loading={loading}
                />
                <div
                  aria-hidden="true"
                  className={`mt-2 flex w-full items-start justify-center rounded-t-[18px] rounded-b-[14px] pt-2 font-display font-extrabold leading-none ${
                    entry
                      ? `shadow-sm ${STEP_STYLES[position]}`
                      : EMPTY_STEP_STYLES[position]
                  }`}
                >
                  {position}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

export function CategoryChips({
  categories = [],
  activeId,
  onSelect,
  hrefFor,
}) {
  if (!categories.length) return null;

  return (
    <div
      role="group"
      aria-label="Seleccionar categoría"
      className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
    >
      {categories.map((category) => {
        const active = category.id === activeId;
        const className = `inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition ${
          active
            ? "bg-ink text-white"
            : "bg-beige text-ink hover:bg-[#ebe0d4]"
        }`;

        if (hrefFor) {
          return (
            <Link
              key={category.id}
              href={hrefFor(category)}
              aria-current={active ? "true" : undefined}
              className={className}
            >
              {category.image ? (
                <Image
                  src={category.image}
                  alt=""
                  width={20}
                  height={20}
                  className="mr-1.5 h-5 w-5 shrink-0 rounded-md object-cover"
                />
              ) : null}
              {category.label}
            </Link>
          );
        }

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect?.(category.id)}
            aria-pressed={active}
            className={className}
          >
            {category.image ? (
              <Image
                src={category.image}
                alt=""
                width={20}
                height={20}
                className="mr-1.5 h-5 w-5 shrink-0 rounded-md object-cover"
              />
            ) : null}
            {category.label}
          </button>
        );
      })}
    </div>
  );
}
