"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Star } from "lucide-react";
import { BackLink, EmptyState, Pill, RatingLine } from "@/components/ui";
import { getAdjustedProductScore, MIN_RATINGS_FOR_RANKING } from "@/lib/scoring";
import { submitRating } from "@/lib/api";
import { useProduct } from "@/lib/hooks";
import { useSaved } from "@/components/saved-provider";

const ratingLabels = ["Muy mala", "Mala", "Regular", "Buena", "Excelente"];

export default function DishClient({ productId }) {
  const { product, business, category } = useProduct(productId);
  const { isSaved, toggleSaved } = useSaved();
  const [selectedRating, setSelectedRating] = useState(null);
  const [ratingMessage, setRatingMessage] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRate = async (value) => {
    setSelectedRating(value);
    setRatingError("");
    setRatingMessage("");
    setSubmitting(true);
    try {
      await submitRating(product.id, value);
      setRatingMessage(
        `Gracias. Registraste ${value} de 5 (${ratingLabels[
          value - 1
        ].toLowerCase()}) para este mes. No se solicitan comentarios.`,
      );
    } catch (error) {
      setRatingError(
        error.message ||
          "No se pudo guardar la puntuación. Intenta de nuevo más tarde.",
      );
    } finally {
      setSubmitting(false);
    }
  };

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

      <section className="relative flex h-52 items-center justify-center rounded-[30px] bg-amber-tint sm:h-64">
        <span className="text-[100px] sm:text-[124px]">
          {product.emoji || "🍽️"}
        </span>
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

      <div className="mt-5 grid gap-5 md:grid-cols-[1fr_360px]">
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

        <aside className="h-fit rounded-[24px] bg-accent-tint p-5">
          <h2 className="font-display text-2xl tracking-[-0.03em] text-ink">
            ¿Ya lo probaste?
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted">
            Puntuar es opcional y toma un toque.
          </p>

          <div className="mt-4 grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => handleRate(value)}
                disabled={submitting}
                aria-pressed={selectedRating === value}
                aria-label={`${value} de 5 estrellas, ${ratingLabels[value - 1]}`}
                className={`flex min-h-16 flex-col items-center justify-center rounded-2xl border text-sm font-semibold transition disabled:opacity-60 ${
                  selectedRating === value
                    ? "border-accent bg-accent text-white"
                    : "border-transparent bg-white text-ink hover:border-accent/30"
                }`}
              >
                <Star
                  className={`h-5 w-5 ${
                    selectedRating === value
                      ? "fill-white text-white"
                      : "fill-mustard text-mustard"
                  }`}
                />
                {value}
              </button>
            ))}
          </div>

          {ratingMessage ? (
            <p className="mt-4 rounded-2xl bg-white/70 p-3 text-xs leading-5 text-ink">
              {ratingMessage}
            </p>
          ) : null}
          {ratingError ? (
            <p className="mt-3 text-xs font-semibold text-accent">
              {ratingError}
            </p>
          ) : null}

          <p className="mt-4 text-[10px] leading-4 text-[#8a5a00]">
            Los datos de esta versión son ficticios y no se guardan en un
            servidor.
          </p>
        </aside>
      </div>
    </div>
  );
}
