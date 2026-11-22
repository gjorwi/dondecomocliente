"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";
import { BackLink, EmptyState, Pill, RatingLine } from "@/components/ui";
import { getAdjustedProductScore, MIN_RATINGS_FOR_RANKING } from "@/lib/scoring";
import { useProduct } from "@/lib/hooks";
import { useSaved } from "@/components/saved-provider";

export default function DishClient({ productId }) {
  const { product, business, category } = useProduct(productId);
  const { isSaved, toggleSaved } = useSaved();

  if (!product) {
    return (
      <div>
        <BackLink href="/" />
        <EmptyState
          title="No encontramos este plato"
          description="Puede que ya no esté disponible en la demo."
          action="Volver a explorar"
          href="/"
        />
      </div>
    );
  }

  const score = getAdjustedProductScore(product);
  const savedKey = `dish:${product.id}`;
  const saved = isSaved(savedKey);

  return (
    <div>
      <BackLink href={business ? `/local/${business.id}` : "/"} />

      <section className="relative flex h-52 items-center justify-center overflow-hidden rounded-[30px] bg-amber-tint sm:h-64">
        {product.image ? (
          <Image
            src={product.image}
            alt={`Foto de ${product.name}`}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 1152px"
            className="object-cover"
          />
        ) : (
          <span className="text-[100px] sm:text-[124px]">
            {product.emoji || "🍽️"}
          </span>
        )}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Pill>{category?.label || "Plato"}</Pill>
          {product.isAvailable === false ? (
            <Pill tone="dark">No disponible hoy</Pill>
          ) : null}
          {business?.isOpen ? <Pill tone="open">Abierto ahora</Pill> : null}
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(savedKey)}
          aria-label={saved ? "Quitar plato de favoritos" : "Añadir plato a favoritos"}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
        >
          <Heart
            className={`h-5 w-5 ${
              saved ? "fill-accent text-accent" : "text-ink"
            }`}
          />
        </button>
      </section>

      <div className="mt-5 max-w-3xl">
        <div>
          <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.04em] text-ink sm:text-[46px]">
            {product.name}
          </h1>
          {business ? (
            <Link
              href={`/local/${business.id}`}
              className="mt-2 inline-flex items-center gap-1 text-sm text-muted hover:text-accent"
            >
              {business.name} · {business.zone}, Coro
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : null}

          <div className="mt-4 rounded-[24px] bg-soft p-5">
            <RatingLine
              score={score}
              count={product.ratingsCount}
              compact={false}
            />
            <p className="mt-2 text-xs leading-5 text-muted">
              {product.ratingsCount < MIN_RATINGS_FOR_RANKING
                ? "Puntuación provisional; aún faltan datos para entrar en el ranking."
                : "Puntuación del plato, ajustada según los datos disponibles."}
            </p>
          </div>

          <div className="mt-5 flex items-start justify-between gap-4">
            <p className="max-w-xl text-sm leading-6 text-muted">
              {product.description}
            </p>
            <p className="shrink-0 font-display text-2xl text-accent">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href={business ? `/local/${business.id}` : "/"}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-[#b33a0d]"
            >
              Ver establecimiento
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={`/categoria/${product.categoryId}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-beige px-5 text-sm font-semibold text-ink transition hover:bg-[#ebe0d4]"
            >
              Ver Top 3 de la categoría
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
