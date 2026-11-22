"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Store } from "lucide-react";
import {
  BusinessCard,
  CardGrid,
  CategoryCard,
  Pill,
  SearchField,
  SectionTitle,
} from "@/components/ui";
import { PromoCarousel } from "@/components/promo-carousel";
import { useBusinesses, useCategories } from "@/lib/hooks";
import { promotions } from "@/lib/mock-data";

export default function ExploreClient() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [onlyOpen, setOnlyOpen] = useState(false);
  const { categories } = useCategories();
  const { businesses } = useBusinesses();

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
            <h1 className="mt-3 font-display text-[38px] leading-[1.02] tracking-[-0.045em] sm:text-[52px]">
              ¿Qué se te antoja hoy?
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/80 sm:text-[15px]">
              Encuentra platos bien puntuados, compara la reputación de cada
              establecimiento y contacta directamente con el local.
            </p>
          </div>
          <div className="mt-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">
              Buscar por categoría
            </p>
            <div className="no-scrollbar mt-2.5 flex w-full flex-nowrap gap-2 overflow-x-auto pb-1">
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
          </div>
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
          placeholder="¿Qué quieres comer? Busca un plato o local"
        />
      </div>

      <PromoCarousel promotions={promotions} />

      <SectionTitle
        title="Mejores por categoría"
        description="El plato mejor puntuado de cada categoría. Toca una para ver su Top 3."
      />
      <CardGrid>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </CardGrid>

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
      {recommendedBusinesses.length ? (
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
        className="group mt-8 flex flex-col gap-4 rounded-[28px] bg-accent p-6 text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg sm:flex-row sm:items-center sm:justify-between sm:p-7"
      >
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
            <Store className="h-7 w-7" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Para negocios
            </p>
            <h2 className="mt-1 font-display text-[26px] leading-tight tracking-[-0.035em]">
              ¿Tienes un negocio de comida?
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-white/80">
              Solicita tu registro y aparece en comidasTop. Revisamos cada
              solicitud y te entregamos tus accesos para administrar tu menú.
            </p>
          </div>
        </div>
        <span className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-accent">
          Solicitar registro
          <ArrowRight
            className="h-4 w-4 transition group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </span>
      </Link>

      <div className="mt-8 flex flex-col items-center gap-2 rounded-[24px] border border-line bg-white px-5 py-5 text-center">
        <Pill tone="amber">Datos de demostración</Pill>
        <p className="max-w-xl text-xs leading-5 text-muted">
          Las puntuaciones se calculan a partir de platos puntuados. La
          información de esta versión es ficticia.
        </p>
      </div>
    </div>
  );
}
