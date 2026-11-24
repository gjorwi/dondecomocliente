"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Trophy } from "lucide-react";
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

function PodiumEntry({ entry, position, demo, categoryId, categoryImage }) {
  const data = entryData(entry);

  if (!data) {
    return (
      <div className="flex min-w-0 flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/70 text-xl text-muted sm:h-16 sm:w-16">
          ?
        </span>
        <p className="mt-1.5 text-[11px] font-semibold leading-tight text-muted sm:text-sm">
          Aún sin datos
        </p>
        <p className="mt-0.5 text-[10px] text-muted sm:text-xs">—</p>
      </div>
    );
  }

  const href = demo
    ? `/buscar?categoria=${encodeURIComponent(categoryId || "")}`
    : `/plato/${data.product.id}`;

  const content = (
    <>
      <span className="relative inline-flex shrink-0">
        <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm ring-1 ring-line/70 sm:h-16 sm:w-16">
          {data.product.image || categoryImage ? (
            <Image
              src={data.product.image || categoryImage}
              alt=""
              fill
              unoptimized
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <span className="text-[28px] sm:text-[34px]">
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
    <div className="flex min-w-0 flex-col items-center text-center">
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
  categoryId,
  categoryLabel = "",
  categoryImage,
}) {
  const byPosition = new Map(
    entries.map((entry, index) => [entry.position || index + 1, entry]),
  );

  return (
    <ol
      className="grid grid-cols-3 items-end gap-2 sm:gap-3"
      aria-label={
        categoryLabel ? `Top 3 de ${categoryLabel} en Coro` : "Top 3 en Coro"
      }
    >
      {POSITIONS.map((position) => (
        <li
          key={position}
          className={`${COLUMN_STYLES[position]} row-start-1 flex min-w-0 flex-col items-center`}
        >
          <PodiumEntry
            entry={byPosition.get(position)}
            position={position}
            demo={demo}
            categoryId={categoryId}
            categoryImage={categoryImage}
          />
          <div
            aria-hidden="true"
            className={`mt-2 flex w-full max-w-[132px] items-start justify-center rounded-t-[18px] rounded-b-[14px] pt-2 font-display font-extrabold leading-none shadow-sm ${STEP_STYLES[position]}`}
          >
            {position}
          </div>
        </li>
      ))}
    </ol>
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
