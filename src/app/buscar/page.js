"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navigation, SlidersHorizontal } from "lucide-react";
import {
  BusinessCard,
  CardGrid,
  DishCard,
  EmptyState,
  SearchField,
  SectionTitle,
} from "@/components/ui";
import { normalizeText } from "@/lib/mock-data";
import { getAdjustedProductScore } from "@/lib/scoring";
import {
  useBusinesses,
  useCategories,
  useProducts,
} from "@/lib/hooks";

const resultTypes = [
  { id: "todo", label: "Todo" },
  { id: "platos", label: "Platos" },
  { id: "locales", label: "Locales" },
];

const zoneDistance = {
  Norte: 1.2,
  "Zona colonial": 1.6,
  Centro: 2.1,
  Sur: 3.2,
  Este: 3.8,
  Oeste: 4.6,
};

function getZoneDistance(business) {
  return zoneDistance[business?.zone] ?? 99;
}

function Chip({ children, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex min-h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition ${
        selected
          ? "bg-ink text-white"
          : "bg-beige text-ink hover:bg-[#ebe0d4]"
      }`}
    >
      {children}
    </button>
  );
}

function SearchContent({ initialQuery, initialCategory }) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState("todo");
  const [categoryId, setCategoryId] = useState(initialCategory);
  const [onlyOpen, setOnlyOpen] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const { categories } = useCategories();
  const { products } = useProducts();
  const { businesses } = useBusinesses();
  const businessMap = useMemo(
    () => new Map(businesses.map((business) => [business.id, business])),
    [businesses],
  );

  const normalizedQuery = normalizeText(query);

  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
      const business = businessMap.get(product.businessId);
      const text = normalizeText(
        `${product.name} ${business?.name} ${business?.zone} ${product.categoryId}`,
      );
      const matchesQuery = !normalizedQuery || text.includes(normalizedQuery);
      const matchesCategory =
        categoryId === "todos" || product.categoryId === categoryId;
      const matchesOpen = !onlyOpen || business?.isOpen;
      return (
        matchesQuery &&
        matchesCategory &&
        matchesOpen &&
        product.isActive !== false
      );
    });

    return list.sort((a, b) => {
      const scoreDiff =
        getAdjustedProductScore(b) - getAdjustedProductScore(a);
      if (!nearMe) return scoreDiff;
      const distanceDiff =
        getZoneDistance(businessMap.get(a.businessId)) -
        getZoneDistance(businessMap.get(b.businessId));
      return distanceDiff || scoreDiff;
    });
  }, [businessMap, categoryId, nearMe, normalizedQuery, onlyOpen, products]);

  const filteredBusinesses = useMemo(() => {
    const list = businesses.filter((business) => {
      const businessProducts = products.filter(
        (product) => product.businessId === business.id,
      );
      const text = normalizeText(
        `${business.name} ${business.zone} ${business.address} ${businessProducts
          .map((product) => product.name)
          .join(" ")}`,
      );
      const matchesCategory =
        categoryId === "todos" ||
        businessProducts.some((product) => product.categoryId === categoryId);
      return (
        (!normalizedQuery || text.includes(normalizedQuery)) &&
        (!onlyOpen || business.isOpen) &&
        matchesCategory
      );
    });

    if (nearMe) {
      list.sort((a, b) => getZoneDistance(a) - getZoneDistance(b));
    }
    return list;
  }, [businesses, categoryId, nearMe, normalizedQuery, onlyOpen, products]);

  const showProducts = type !== "locales";
  const showBusinesses = type !== "platos";
  const isEmpty =
    (showProducts ? filteredProducts.length === 0 : true) &&
    (showBusinesses ? filteredBusinesses.length === 0 : true);

  return (
    <div>
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Buscar en Coro
        </p>
        <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
          Encuentra tu próximo plato
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Busca por plato, establecimiento, zona o categoría.
        </p>
      </div>

      <div className="mt-5 max-w-3xl">
        <SearchField
          value={query}
          onChange={setQuery}
          onSubmit={() => {}}
          placeholder="¿Qué quieres comer?"
          showButton={false}
        />
      </div>

      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {resultTypes.map((item) => (
          <Chip
            key={item.id}
            selected={type === item.id}
            onClick={() => setType(item.id)}
          >
            {item.label}
          </Chip>
        ))}
      </div>

      <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
        <Chip
          selected={categoryId === "todos"}
          onClick={() => setCategoryId("todos")}
        >
          Todas
        </Chip>
        {categories.map((category) => (
          <Chip
            key={category.id}
            selected={categoryId === category.id}
            onClick={() => setCategoryId(category.id)}
          >
            {category.label}
          </Chip>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setOnlyOpen((current) => !current)}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
            onlyOpen
              ? "border-open bg-green-tint text-open"
              : "border-line bg-white text-ink hover:bg-soft"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Abierto ahora
          <span className="text-xs font-normal text-muted">
            {onlyOpen ? "Activo" : "Filtrar"}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setNearMe((current) => !current)}
          aria-pressed={nearMe}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
            nearMe
              ? "border-accent bg-accent-tint text-accent"
              : "border-line bg-white text-ink hover:bg-soft"
          }`}
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Cerca de mí
          <span className="text-xs font-normal text-muted">
            {nearMe ? "Activo" : "Ordenar"}
          </span>
        </button>
      </div>

      {isEmpty ? (
        <div className="mt-6">
          <EmptyState
            title="No encontramos resultados"
            description="Prueba otro plato, local o categoría."
            action="Limpiar búsqueda"
            href="/buscar"
          />
        </div>
      ) : null}

      {showProducts && filteredProducts.length > 0 ? (
        <>
          <SectionTitle
            title="Platos"
            description={`${filteredProducts.length} resultados${
              nearMe ? " · más cercanos primero" : ""
            }`}
          />
          <CardGrid>
            {filteredProducts.map((product) => (
              <DishCard key={product.id} product={product} />
            ))}
          </CardGrid>
        </>
      ) : null}

      {showBusinesses && filteredBusinesses.length > 0 ? (
        <>
          <SectionTitle
            title="Establecimientos"
            description={`${filteredBusinesses.length} resultados${
              nearMe ? " · más cercanos primero" : ""
            }`}
          />
          <CardGrid>
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </CardGrid>
        </>
      ) : null}

      <p className="mt-8 text-center text-xs text-muted">
        Puntuaciones de platos · Sin comentarios escritos
      </p>
    </div>
  );
}

function SearchResults() {
  const searchParams = useSearchParams();
  const { categories } = useCategories();
  const initialQuery = searchParams.get("q") || "";
  const requestedCategory = searchParams.get("categoria") || "todos";
  const initialCategory = categories.some(
    (category) => category.id === requestedCategory,
  )
    ? requestedCategory
    : "todos";

  return (
    <SearchContent
      key={`${initialQuery}-${initialCategory}`}
      initialQuery={initialQuery}
      initialCategory={initialCategory}
    />
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
          Cargando búsqueda…
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
