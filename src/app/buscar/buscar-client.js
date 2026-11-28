"use client";

import { Suspense, useMemo, useState, useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowDownWideNarrow,
  ChevronDown,
  Clock3,
  Navigation,
  SlidersHorizontal,
} from "lucide-react";
import {
  BusinessCard,
  CardGrid,
  DishCard,
  EmptyState,
  SearchField,
  SectionTitle,
} from "@/components/ui";
import { normalizeText } from "@/lib/text";
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

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

function subscribeToDesktop(callback) {
  const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getDesktopSnapshot() {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

function getDesktopServerSnapshot() {
  return false;
}

function getDistanceKm(business, origin) {
  const lat = business?.location?.lat;
  const lng = business?.location?.lng;
  if (
    !origin ||
    typeof lat !== "number" ||
    typeof lng !== "number" ||
    !Number.isFinite(lat) ||
    !Number.isFinite(lng)
  ) {
    return Number.POSITIVE_INFINITY;
  }

  const radians = (degrees) => (degrees * Math.PI) / 180;
  const deltaLat = radians(lat - origin.lat);
  const deltaLng = radians(lng - origin.lng);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(radians(origin.lat)) *
      Math.cos(radians(lat)) *
      Math.sin(deltaLng / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
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
  const [lowestPrice, setLowestPrice] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(null);
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    getDesktopSnapshot,
    getDesktopServerSnapshot,
  );
  const filtersExpanded = filtersOpen ?? isDesktop;
  const { categories } = useCategories();
  const availableCategories = categories.filter(
    (category) => category.available !== false,
  );
  const { products, isLoading: productsLoading } = useProducts();
  const { businesses, isLoading: businessesLoading } = useBusinesses();
  const businessMap = useMemo(
    () => new Map(businesses.map((business) => [business.id, business])),
    [businesses],
  );

  const activeFilterCount =
    (type !== "todo" ? 1 : 0) +
    (categoryId !== "todos" ? 1 : 0) +
    (onlyOpen ? 1 : 0) +
    (nearMe ? 1 : 0) +
    (lowestPrice ? 1 : 0);

  const clearFilters = () => {
    setType("todo");
    setCategoryId("todos");
    setOnlyOpen(false);
    setNearMe(false);
    setLowestPrice(false);
    setUserLocation(null);
    setLocationError("");
  };

  const toggleLowestPrice = () => {
    const next = !lowestPrice;
    setLowestPrice(next);
    if (next) {
      setNearMe(false);
      setUserLocation(null);
      setLocationError("");
    }
  };

  const toggleNearMe = () => {
    if (nearMe) {
      setNearMe(false);
      setUserLocation(null);
      setLocationError("");
      return;
    }
    if (!navigator.geolocation) {
      setLocationError("Tu navegador no permite acceder a la ubicación.");
      return;
    }

    setLocationError("");
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        setNearMe(true);
        setLowestPrice(false);
        setLocationLoading(false);
      },
      () => {
        setLocationError("No pudimos obtener tu ubicación. Revisa los permisos del navegador.");
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const normalizedQuery = normalizeText(query);

  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
      const business = businessMap.get(product.businessId);
        const text = normalizeText(
          `${product.name} ${business?.name} ${business?.municipality} ${business?.parish} ${business?.sector} ${business?.address} ${product.categoryId}`,
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
      if (lowestPrice) {
        const priceA = Number(a.price);
        const priceB = Number(b.price);
        const priceDiff =
          (Number.isFinite(priceA) && priceA > 0 ? priceA : Infinity) -
          (Number.isFinite(priceB) && priceB > 0 ? priceB : Infinity);
        if (priceDiff) return priceDiff;
      }
      const scoreDiff =
        getAdjustedProductScore(b) - getAdjustedProductScore(a);
      if (!nearMe) return scoreDiff;
      const distanceDiff =
        getDistanceKm(businessMap.get(a.businessId), userLocation) -
        getDistanceKm(businessMap.get(b.businessId), userLocation);
      return distanceDiff || scoreDiff;
    });
  }, [
    businessMap,
    categoryId,
    lowestPrice,
    nearMe,
    normalizedQuery,
    onlyOpen,
    products,
    userLocation,
  ]);

  const filteredBusinesses = useMemo(() => {
    const list = businesses.filter((business) => {
      const businessProducts = products.filter(
        (product) => product.businessId === business.id,
      );
      const text = normalizeText(
        `${business.name} ${business.municipality} ${business.parish} ${business.sector} ${business.address} ${businessProducts
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

    if (lowestPrice) {
      const cheapestProductPrice = (business) => {
        const prices = products
          .filter((product) => product.businessId === business.id)
          .map((product) => Number(product.price))
          .filter((price) => Number.isFinite(price) && price > 0);
        return prices.length ? Math.min(...prices) : Number.POSITIVE_INFINITY;
      };
      list.sort((a, b) => cheapestProductPrice(a) - cheapestProductPrice(b));
    } else if (nearMe) {
      list.sort(
        (a, b) =>
          getDistanceKm(a, userLocation) - getDistanceKm(b, userLocation),
      );
    }
    return list;
  }, [
    businesses,
    categoryId,
    lowestPrice,
    nearMe,
    normalizedQuery,
    onlyOpen,
    products,
    userLocation,
  ]);

  const showProducts = type !== "locales";
  const showBusinesses = type !== "platos";
  const resultsLoading = productsLoading || businessesLoading;
  const isEmpty =
    !resultsLoading &&
    (showProducts ? filteredProducts.length === 0 : true) &&
    (showBusinesses ? filteredBusinesses.length === 0 : true);

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-clip">
      <div className="max-w-3xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Buscar en Coro
        </p>
        <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
          Encuentra tu próximo plato
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Busca por plato, establecimiento, municipio, parroquia, sector o categoría.
        </p>
      </div>

      <div className="mt-5 w-full min-w-0 max-w-3xl">
        <SearchField
          value={query}
          onChange={setQuery}
          onSubmit={() => {}}
          placeholder="¿Qué quieres comer?"
          showButton={false}
        />
      </div>

      <div className="mt-4 w-full min-w-0 max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
          Categorías
        </p>
        <div className="no-scrollbar mt-2 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1">
          <Chip
            selected={categoryId === "todos"}
            onClick={() => setCategoryId("todos")}
          >
            Todas
          </Chip>
          {availableCategories.map((category) => (
            <Chip
              key={category.id}
              selected={categoryId === category.id}
              onClick={() => setCategoryId(category.id)}
            >
              {category.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4 flex w-full min-w-0 flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setFiltersOpen((current) => !(current ?? isDesktop))}
          aria-expanded={filtersExpanded}
          aria-controls="search-filters"
          className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
            activeFilterCount
              ? "border-accent/40 bg-accent-tint text-accent"
              : "border-line bg-white text-ink hover:bg-soft"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filtros
          {activeFilterCount ? (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] text-white">
              {activeFilterCount}
            </span>
          ) : null}
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              filtersExpanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {activeFilterCount ? (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs font-semibold text-accent hover:underline"
          >
            Limpiar filtros
          </button>
        ) : null}
      </div>

      <div
        id="search-filters"
        className={`mt-3 w-full min-w-0 gap-4 overflow-hidden rounded-[24px] border border-line/70 bg-white p-4 shadow-sm ${
          filtersExpanded ? "grid" : "hidden"
        }`}
      >
        <div className="w-full min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Tipo de resultado
          </p>
          <div className="no-scrollbar mt-2 flex w-full min-w-0 max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1">
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
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setOnlyOpen((current) => !current)}
            aria-pressed={onlyOpen}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
              onlyOpen
                ? "border-open bg-green-tint text-open"
                : "border-line bg-white text-ink hover:bg-soft"
            }`}
          >
            <Clock3 className="h-4 w-4" aria-hidden="true" />
            Abierto ahora
            <span className="text-xs font-normal text-muted">
              {onlyOpen ? "Activo" : "Filtrar"}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleNearMe}
            disabled={locationLoading}
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
              {locationLoading ? "Buscando…" : nearMe ? "Activo" : "Ordenar"}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleLowestPrice}
            aria-pressed={lowestPrice}
            className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition ${
              lowestPrice
                ? "border-accent bg-accent-tint text-accent"
                : "border-line bg-white text-ink hover:bg-soft"
            }`}
          >
            <ArrowDownWideNarrow className="h-4 w-4" aria-hidden="true" />
            Menor precio
            <span className="text-xs font-normal text-muted">
              {lowestPrice ? "Activo" : "Ordenar"}
            </span>
          </button>
        </div>
      </div>
      {locationError ? (
        <p role="status" className="mt-2 text-xs font-semibold text-accent">
          {locationError}
        </p>
      ) : null}

      {resultsLoading ? (
        <div className="mt-6 rounded-[24px] bg-soft p-6 text-center text-sm text-muted">
          Cargando resultados…
        </div>
      ) : null}

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
              lowestPrice
                ? " · menor precio primero"
                : nearMe
                  ? " · más cercanos primero"
                  : ""
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
              lowestPrice
                ? " · menor precio primero"
                : nearMe
                  ? " · más cercanos primero"
                  : ""
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
    (category) =>
      category.id === requestedCategory && category.available !== false,
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

export default function SearchClient() {
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
