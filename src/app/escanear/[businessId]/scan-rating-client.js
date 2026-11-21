"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";
import {
  BackLink,
  EmptyState,
  Pill,
  RatingLine,
  SearchField,
  SectionTitle,
} from "@/components/ui";
import { normalizeText } from "@/lib/mock-data";
import { getAdjustedProductScore } from "@/lib/scoring";
import { submitRating } from "@/lib/api";
import { useBusiness, useCategories } from "@/lib/hooks";
import { hasValidScanFor } from "@/lib/scan-session";

function FilterChip({ children, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex min-h-10 shrink-0 items-center rounded-full px-4 text-sm font-semibold transition ${
        selected
          ? "bg-ink text-white"
          : "bg-beige text-ink hover:bg-[#ebe0d4]"
      }`}
    >
      {children}
    </button>
  );
}

export default function ScanRatingClient({ businessId }) {
  const { business, products, isLoading } = useBusiness(businessId);
  const { categories } = useCategories();
  const [scanAllowed, setScanAllowed] = useState(null);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("todas");
  const [ratings, setRatings] = useState({});
  const [messages, setMessages] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    setScanAllowed(hasValidScanFor(businessId));
  }, [businessId]);

  const categoryNames = useMemo(
    () => new Map(categories.map((category) => [category.id, category.label])),
    [categories],
  );

  const availableCategories = useMemo(
    () =>
      categories.filter((category) =>
        products.some((product) => product.categoryId === category.id),
      ),
    [categories, products],
  );

  const normalizedQuery = normalizeText(query);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const categoryLabel =
          categoryNames.get(product.categoryId) || product.categoryId;
        const text = normalizeText(
          `${product.name} ${categoryLabel} ${product.description || ""}`,
        );
        const matchesQuery =
          !normalizedQuery || text.includes(normalizedQuery);
        const matchesCategory =
          categoryId === "todas" || product.categoryId === categoryId;
        return matchesQuery && matchesCategory;
      }),
    [categoryId, categoryNames, normalizedQuery, products],
  );

  const handleRate = async (product, value) => {
    setSubmittingId(product.id);
    setMessages((current) => ({ ...current, [product.id]: null }));

    try {
      await submitRating(product.id, value);
      setRatings((current) => ({ ...current, [product.id]: value }));
      setMessages((current) => ({
        ...current,
        [product.id]: {
          type: "success",
          text: `Gracias. Registraste ${value} de 5 para este mes.`,
        },
      }));
    } catch (error) {
      setMessages((current) => ({
        ...current,
        [product.id]: {
          type: "error",
          text:
            error instanceof TypeError
              ? "No pudimos conectar con la API. Verifica que esté activa e intenta de nuevo."
              : error.message ||
                "No se pudo guardar la puntuación. Intenta de nuevo.",
        },
      }));
    } finally {
      setSubmittingId(null);
    }
  };

  if (scanAllowed === null) {
    return (
      <div className="mx-auto max-w-lg rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
        Validando escaneo…
      </div>
    );
  }

  if (!scanAllowed) {
    return (
      <div className="mx-auto max-w-lg">
        <BackLink href="/escanear" label="Volver al escáner" />
        <EmptyState
          emoji="🔒"
          title="Escanea el QR para puntuar"
          description="Solo puedes puntuar los platos después de escanear el código QR del local."
          action="Abrir escáner"
          href="/escanear"
        />
      </div>
    );
  }

  if (isLoading && !business) {
    return (
      <div className="mx-auto max-w-lg rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
        Cargando menú del local…
      </div>
    );
  }

  if (!business) {
    return (
      <div className="mx-auto max-w-lg">
        <BackLink href="/escanear" label="Volver al escáner" />
        <EmptyState
          title="No encontramos este local"
          description="Puede que ya no esté disponible en la demo."
          action="Volver al escáner"
          href="/escanear"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <BackLink href="/escanear" label="Volver al escáner" />

      <section className="rounded-[30px] bg-ink px-5 py-6 text-white sm:px-7 sm:py-7">
        <div className="flex items-start gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[22px] bg-white/10 text-[36px]">
            {business.emoji || "🍽️"}
          </span>
          <div className="min-w-0">
            <Pill tone="open">Escaneo verificado</Pill>
            <h1 className="mt-2 font-display text-[30px] leading-[1.05] tracking-[-0.04em] text-white sm:text-[36px]">
              Puntúa el menú de {business.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              Busca el plato que probaste y asígnale de 1 a 5 estrellas. Solo
              está disponible después de escanear el QR del local.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-5">
        <SearchField
          value={query}
          onChange={setQuery}
          onSubmit={() => {}}
          placeholder="Busca un plato del menú"
          showButton={false}
        />
      </div>

      {availableCategories.length > 1 ? (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          <FilterChip
            selected={categoryId === "todas"}
            onClick={() => setCategoryId("todas")}
          >
            Todos
          </FilterChip>
          {availableCategories.map((category) => (
            <FilterChip
              key={category.id}
              selected={categoryId === category.id}
              onClick={() => setCategoryId(category.id)}
            >
              {category.label}
            </FilterChip>
          ))}
        </div>
      ) : null}

      <SectionTitle
        title="Platos del local"
        description={`${filteredProducts.length} ${
          filteredProducts.length === 1 ? "plato" : "platos"
        } para puntuar`}
      />

      {filteredProducts.length ? (
        <div className="grid gap-3">
          {filteredProducts.map((product) => {
            const selectedRating = ratings[product.id];
            const message = messages[product.id];
            const score = getAdjustedProductScore(product);
            const categoryLabel =
              categoryNames.get(product.categoryId) || product.categoryId;

            return (
              <article
                key={product.id}
                className="rounded-[24px] border border-line/70 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-tint text-[28px]">
                    {product.emoji || "🍽️"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-semibold text-ink">
                      {product.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] text-muted">
                      {categoryLabel}
                      {typeof product.price === "number"
                        ? ` · $${product.price.toFixed(2)}`
                        : ""}
                    </p>
                    <div className="mt-1.5">
                      <RatingLine
                        score={score}
                        count={product.ratingsCount}
                        compact
                      />
                    </div>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                      Tu puntuación
                    </p>
                    <p className="mt-0.5 font-display text-xl leading-none text-accent">
                      {selectedRating ? `${selectedRating}/5` : "—"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-3">
                  <p className="text-[11px] font-semibold text-muted">
                    Puntuar este plato
                  </p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => handleRate(product, value)}
                        disabled={submittingId === product.id}
                        aria-pressed={selectedRating === value}
                        aria-label={`${value} de 5 estrellas para ${product.name}`}
                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition disabled:opacity-50 ${
                          selectedRating === value
                            ? "border-accent bg-accent text-white"
                            : "border-line bg-soft text-ink hover:border-accent/40"
                        }`}
                      >
                        <Star
                          className={`h-4 w-4 ${
                            selectedRating === value
                              ? "fill-white text-white"
                              : "fill-mustard text-mustard"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {message ? (
                  <p
                    className={`mt-2 text-[11px] leading-4 ${
                      message.type === "error"
                        ? "font-semibold text-accent"
                        : "text-open"
                    }`}
                  >
                    {message.text}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          emoji="🔎"
          title="No encontramos ese plato"
          description="Prueba con otro nombre o selecciona otra categoría."
        />
      )}

      <p className="mt-8 text-center text-xs text-muted">
        Las puntuaciones se registran por plato. No se solicitan comentarios.
      </p>
    </div>
  );
}
