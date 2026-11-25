"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { BackLink, EmptyState, Pill } from "@/components/ui";
import { CategoryChips, TopThreePodium } from "@/components/podium";
import { demoCategories, getDemoRanking } from "@/lib/demo-ranking";
import { MIN_RATINGS_FOR_RANKING } from "@/lib/scoring";
import { useCategories, useRanking } from "@/lib/hooks";

export default function CategoryClient({ categoryId }) {
  const { category, ranking, isLoading } = useRanking(categoryId);
  const { categories } = useCategories();

  const chipCategories = categories.length
    ? categories.map((item) => ({
        id: item.id,
        label: item.label,
        image: item.image,
      }))
    : demoCategories;
  const demoEntries = getDemoRanking(categoryId);
  const usingDemo = !isLoading && ranking.length === 0 && demoEntries.length > 0;
  const podiumEntries = ranking.length ? ranking : demoEntries;

  if (isLoading && !category) {
    return (
      <div className="rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
        Cargando categoría…
      </div>
    );
  }

  if (!category) {
    return (
      <div>
        <BackLink href="/" />
        <EmptyState
          title="Categoría no encontrada"
          description="La categoría que buscas no está disponible."
          action="Volver a explorar"
          href="/"
        />
      </div>
    );
  }

  return (
    <div>
      <BackLink href="/" />

      <section className="rounded-[30px] bg-accent-tint px-5 py-6 sm:px-7 sm:py-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <Pill tone="amber">Coro · puntuación automática</Pill>
            <h1 className="mt-3 max-w-2xl font-display text-[34px] leading-[1.05] tracking-[-0.04em] text-ink sm:text-[44px]">
              Top 3 de {category.label.toLowerCase()}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
              Los platos mejor puntuados y el establecimiento que los prepara.
            </p>
          </div>
          <Image
            src={category.image}
            alt=""
            width={80}
            height={80}
            className="hidden h-20 w-20 shrink-0 rounded-[24px] object-cover sm:block"
          />
        </div>
      </section>

      <div className="mt-5">
        <CategoryChips
          categories={chipCategories}
          activeId={categoryId}
          hrefFor={(item) => `/categoria/${item.id}`}
        />
      </div>

      <div className="mt-4">
        {isLoading && !ranking.length ? (
          <TopThreePodium
            loading
            categoryLabel={category.label}
            categoryImage={category.image}
          />
        ) : podiumEntries.length ? (
          <>
            <TopThreePodium
              entries={podiumEntries}
              demo={usingDemo}
              categoryId={categoryId}
              categoryLabel={category.label}
              categoryImage={category.image}
            />
            <div className="mt-3 flex min-h-10 flex-wrap items-center gap-2 text-xs leading-5 text-muted sm:min-h-6">
              {usingDemo ? (
                <>
                  <Pill tone="amber">Vista previa</Pill>
                  <span>
                    {podiumEntries.length}{" "}
                    {podiumEntries.length === 1
                      ? "plato clasificado"
                      : "platos clasificados"}{" "}
                    · Datos de ejemplo mientras se acumulan las primeras
                    puntuaciones reales.
                  </span>
                </>
              ) : null}
            </div>
          </>
        ) : (
          <EmptyState
            title="Aún no hay suficientes puntuaciones"
            description={`Para aparecer en este ranking, un plato necesita al menos ${MIN_RATINGS_FOR_RANKING} puntuaciones.`}
            action="Explorar otras categorías"
            href="/"
          />
        )}
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-[24px] bg-white p-4 shadow-sm">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-ink">¿Cómo se ordena?</p>
          <p className="mt-1 text-xs leading-5 text-muted">
            El sistema considera la puntuación del plato y la cantidad de datos
            disponibles. Las calificaciones son opcionales y no incluyen
            comentarios.
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-beige px-5 text-sm font-semibold text-ink transition hover:bg-[#ebe0d4]"
        >
          Explorar todas las categorías
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
