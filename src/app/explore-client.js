"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import {
  BusinessCard,
  CardGrid,
  CardSkeleton,
  SearchField,
  SectionTitle,
} from "@/components/ui";
import {
  CategoryChips,
  CategoryChipsSkeleton,
  TopThreePodium,
} from "@/components/podium";
import { PromoCarousel } from "@/components/promo-carousel";
import { HomeCoupons } from "@/components/home-coupons";
import {
  useBusinesses,
  useCategories,
  usePromotions,
  useRanking,
} from "@/lib/hooks";

export default function ExploreClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const { categories, isLoading: categoriesLoading } = useCategories();
  const { businesses, isLoading: businessesLoading } = useBusinesses();
  const { promotions, isLoading: promotionsLoading } = usePromotions();

  const chipCategories = categories
    .filter((category) => category.top)
    .map((category) => ({
      id: category.id,
      label: category.label,
      image: category.image,
    }));
  const activeCategoryId =
    selectedCategoryId &&
    chipCategories.some((category) => category.id === selectedCategoryId)
      ? selectedCategoryId
      : chipCategories[0]?.id ?? null;
  const { ranking, isLoading: rankingLoading } =
    useRanking(activeCategoryId);
  const activeCategory = chipCategories.find(
    (category) => category.id === activeCategoryId,
  );
  const activeCategoryLabel = activeCategory?.label || "";
  const activeCategoryImage = activeCategory?.image;

  const recommendedBusinesses = useMemo(
    () =>
      businesses
        .filter((business) => !onlyOpen || business.isOpen)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 4),
    [businesses, onlyOpen],
  );

  const openSearch = () => {
    const trimmed = query.trim();
    router.push(trimmed ? `/buscar?q=${encodeURIComponent(trimmed)}` : "/buscar");
  };

  return (
    <div>
      <section className="relative overflow-hidden rounded-[32px] bg-accent px-5 py-8 text-white sm:px-8 sm:py-10">
        <div className="relative z-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
              Coro · Falcón
            </p>
            <h1 className="mt-3 whitespace-nowrap font-display text-[clamp(20px,7.2vw,52px)] leading-[1.02] tracking-[-0.045em]">
              ¿Qué se te antoja hoy?
            </h1>
          </div>
          {categoriesLoading ? (
            <CategoryChipsSkeleton className="mt-5" />
          ) : (
            <div className="no-scrollbar mt-5 flex w-full flex-nowrap gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/buscar?categoria=${category.id}`}
                  className="inline-flex min-h-9 shrink-0 items-center whitespace-nowrap rounded-full border border-white/15 bg-white/12 px-3.5 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  {category.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        <span className="pointer-events-none absolute -right-12 -top-10 hidden text-[190px] opacity-20 sm:block">
          🍽️
        </span>
      </section>

      <div className="mx-auto mt-4 max-w-3xl">
        <SearchField
          value={query}
          onChange={setQuery}
          onSubmit={openSearch}
          placeholder="¿Qué quieres comer?"
        />
      </div>

      <PromoCarousel promotions={promotions} loading={promotionsLoading} />

      <HomeCoupons />

      <SectionTitle
        title="Mejores por categoría"
        description="Los tres mejor puntuados de cada categoría. Elige una para ver su podio."
        action={activeCategoryId ? "Ver todos" : undefined}
        href={activeCategoryId ? `/categoria/${activeCategoryId}` : undefined}
      />
      {categoriesLoading ? (
        <div>
          <CategoryChipsSkeleton light />
          <div className="mt-4">
            <TopThreePodium loading />
          </div>
        </div>
      ) : chipCategories.length ? (
        <>
          <CategoryChips
            categories={chipCategories}
            activeId={activeCategoryId}
            onSelect={setSelectedCategoryId}
          />

          <div className="mt-4">
            {rankingLoading ? (
              <TopThreePodium
                loading
                categoryLabel={activeCategoryLabel}
                categoryImage={activeCategoryImage}
              />
            ) : ranking.length ? (
              <TopThreePodium
                entries={ranking}
                categoryLabel={activeCategoryLabel}
                categoryImage={activeCategoryImage}
              />
            ) : (
              <div className="rounded-[24px] bg-soft p-6 text-center text-sm text-muted">
                Aún no hay suficientes puntuaciones en esta categoría.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="rounded-[24px] bg-soft p-6 text-center text-sm text-muted">
          Aún no hay categorías disponibles para mostrar un Top.
        </div>
      )}

      <div className="mt-7 flex items-center justify-between gap-3 rounded-[24px] bg-white px-4 py-3.5 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-ink">Solo abiertos ahora</p>
          <p className="mt-0.5 text-xs text-muted">
            Filtra locales listos para atenderte
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={onlyOpen}
          aria-label="Filtrar establecimientos abiertos ahora"
          onClick={() => setOnlyOpen((current) => !current)}
          className={`relative h-8 w-14 shrink-0 rounded-full p-1 transition ${
            onlyOpen ? "bg-open" : "bg-line"
          }`}
        >
          <span
            className={`block h-6 w-6 rounded-full bg-white shadow-sm transition ${
              onlyOpen ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <SectionTitle
        title={onlyOpen ? "Locales abiertos ahora" : "Locales recomendados"}
        description="Ordenados por la puntuación calculada de sus platos."
        action="Ver todos"
        href="/buscar"
      />
      {businessesLoading ? (
        <CardGrid>
          {Array.from({ length: 4 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </CardGrid>
      ) : recommendedBusinesses.length ? (
        <CardGrid>
          {recommendedBusinesses.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </CardGrid>
      ) : (
        <div className="rounded-[24px] bg-soft p-6 text-center text-sm text-muted">
          No hay locales abiertos con ese filtro en este momento.
        </div>
      )}

      <Link
        href="/solicitud-negocio"
        className="group mt-8 flex flex-col gap-5 rounded-[28px] bg-accent p-6 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-7"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 sm:h-14 sm:w-14">
            <Store className="h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Para negocios
            </p>
            <h2 className="mt-1 font-display text-[22px] leading-tight tracking-[-0.035em] sm:text-[26px]">
              ¿Tienes un negocio de comida?
            </h2>
          </div>
        </div>
        <span className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-accent sm:w-auto">
          Solicitar registro
          <ArrowRight
            className="h-4 w-4 transition group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>

    </div>
  );
}
