"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import { Star } from "lucide-react";
import {
  BackLink,
  EmptyState,
  Pill,
  RatingLine,
  SearchField,
  SectionTitle,
} from "@/components/ui";
import { GoogleLoginButton } from "@/components/google-login-button";
import { useClientAuth } from "@/components/auth-provider";
import { normalizeText } from "@/lib/text";
import { getAdjustedProductScore } from "@/lib/scoring";
import { formatPriceSummary } from "@/lib/price";
import { submitRating, fetchScanStatus, registerScan } from "@/lib/api";
import { getCurrentLocation } from "@/lib/geolocation";
import { useBusiness, useCategories } from "@/lib/hooks";
import {
  clearScanSession,
  readScanSession,
  saveScanSession,
  updateScanSessionVotes,
} from "@/lib/scan-session";

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
  const { user, ready: authReady } = useClientAuth();
  const { mutate: mutateGlobal } = useSWRConfig();
  const userId = user?.id;
  const pathname = usePathname();
  const router = useRouter();
  const [scanAllowed, setScanAllowed] = useState(null);
  const [scanError, setScanError] = useState("");
  const [visitId, setVisitId] = useState(null);
  const [votesRemaining, setVotesRemaining] = useState(0);
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("todas");
  const [ratings, setRatings] = useState({});
  const [messages, setMessages] = useState({});
  const [submittingId, setSubmittingId] = useState(null);

  useEffect(() => {
    if (!authReady || !userId) return undefined;

    let active = true;
    const session = readScanSession();
    const valid =
      session && session.businessId === businessId ? session : null;

    if (!valid) {
      setScanError("");
      getCurrentLocation()
        .then((location) => registerScan(businessId, location))
        .then((payload) => {
          if (!active) return;
          saveScanSession(businessId, payload.visit);
          setVisitId(payload.visit.id);
          setVotesRemaining(payload.visit.votesRemaining);
          setScanAllowed(true);
        })
        .catch((error) => {
          if (!active) return;
          setScanError(
            error instanceof TypeError
              ? "No pudimos conectar con la API. Verifica que esté activa e intenta de nuevo."
              : error.message ||
                  "No pudimos validar que estés en el local. Intenta de nuevo.",
          );
          setScanAllowed(false);
        });
    } else {
      setScanAllowed(true);
      setVisitId(valid.visitId || null);
      setVotesRemaining(valid.votesRemaining ?? 0);

      fetchScanStatus(businessId)
        .then((payload) => {
          if (!active) return;
          if (!payload.visit) {
            clearScanSession();
            setScanAllowed(false);
            setVotesRemaining(0);
            return;
          }
          setVisitId(payload.visit.id);
          setVotesRemaining(payload.visit.votesRemaining);
          updateScanSessionVotes(businessId, payload.visit.votesRemaining);
        })
        .catch(() => {
          // La validación definitiva también ocurre al enviar el voto.
        });
    }

    return () => {
      active = false;
    };
  }, [authReady, businessId, userId]);

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
    if (votesRemaining <= 0 || ratings[product.id] || submittingId) return;

    setSubmittingId(product.id);
    setMessages((current) => ({ ...current, [product.id]: null }));

    try {
      const payload = await submitRating(product.id, value, visitId);
      const remaining =
        typeof payload.visit?.votesRemaining === "number"
          ? payload.visit.votesRemaining
          : Math.max(0, votesRemaining - 1);

      setRatings((current) => ({ ...current, [product.id]: value }));
      setVotesRemaining(remaining);
      updateScanSessionVotes(businessId, remaining);
      await mutateGlobal("/auth/me");

      const pointsEarned = Number(payload.pointsEarned) || 0;
      const achievements = payload.achievementsUnlocked || [];
      const pointsText =
        pointsEarned > 0 ? ` Ganaste ${pointsEarned} puntos.` : "";
      const achievementsText = achievements.length
        ? ` Logro desbloqueado: ${achievements
            .map((achievement) => achievement.title)
            .join(", ")}.`
        : "";
      const votesText =
        remaining > 0
          ? `Te queda ${remaining} ${remaining === 1 ? "voto" : "votos"} de este escaneo.`
          : "Usaste los 2 votos de este escaneo.";
      setMessages((current) => ({
        ...current,
        [product.id]: {
          type: "success",
          text: `Gracias. Registramos tu voto. ${votesText}${pointsText}${achievementsText}`,
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

  if (!authReady) {
    return (
      <div className="mx-auto max-w-lg rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
        Preparando tu sesión…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-lg">
        <BackLink href="/escanear" label="Volver al escáner" />
        <div className="rounded-[28px] bg-white p-5 shadow-sm sm:p-6">
          <Pill tone="amber">Acceso requerido</Pill>
          <h1 className="mt-3 font-display text-[28px] leading-tight tracking-[-0.035em] text-ink">
            Inicia sesión para puntuar
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Para cuidar la transparencia del ranking, las puntuaciones se
            asocian a una cuenta verificada. Así evitamos votos duplicados y
            guardamos tu historial.
          </p>
          <div className="mt-5">
            <GoogleLoginButton next={pathname} />
          </div>
        </div>
      </div>
    );
  }

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
        {scanError ? (
          <div
            role="alert"
            className="mb-4 rounded-[20px] bg-accent-tint p-4 text-sm font-semibold leading-5 text-accent"
          >
            {scanError}
          </div>
        ) : null}
        <EmptyState
          emoji="🔒"
          title={
            scanError
              ? "No pudimos validar tu visita"
              : "Necesitas un nuevo escaneo"
          }
          description={
            scanError ||
            "El escaneo anterior ya fue usado o venció. Vuelve a escanear el código QR del local para seguir puntuando."
          }
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
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="open">Escaneo verificado</Pill>
              <Pill tone={votesRemaining > 0 ? "amber" : "dark"}>
                {votesRemaining > 0
                  ? `${votesRemaining} de 2 votos disponibles`
                  : "Sin votos disponibles"}
              </Pill>
            </div>
            <h1 className="mt-2 font-display text-[30px] leading-[1.05] tracking-[-0.04em] text-white sm:text-[36px]">
              Puntúa el menú de {business.name}
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/70">
              Busca el plato que probaste y asígnale de 1 a 5 estrellas. Cada
              plato admite un solo voto por dispositivo y por cuenta.
            </p>
            {votesRemaining > 0 ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-xs font-semibold text-ink transition hover:bg-white/90"
                >
                  Votar después
                </button>
                <span className="text-[11px] leading-4 text-white/60">
                  Puedes usar tus votos durante las próximas 24 h desde el botón
                  de votación pendiente.
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {votesRemaining === 0 ? (
        <div className="mt-4 rounded-[24px] bg-amber-tint p-4 text-sm leading-6 text-[#6a4700]">
          <p className="font-semibold">Usaste los 2 votos de este escaneo.</p>
          <p className="mt-1 text-xs leading-5">
            El escaneo queda como histórico. Para seguir puntuando otros platos,
            vuelve a escanear el QR del local.
          </p>
          <Link
            href="/escanear"
            className="mt-3 inline-flex min-h-10 items-center rounded-full bg-accent px-4 text-xs font-semibold text-white transition hover:bg-[#b33a0d]"
          >
            Escanear de nuevo
          </Link>
        </div>
      ) : null}

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

      {votesRemaining === 0 && filteredProducts.length ? (
        <p className="mb-3 rounded-2xl bg-soft p-3 text-xs leading-5 text-muted">
          Puedes seguir viendo el menú, pero necesitas un nuevo escaneo para
          votar por otros platos.
        </p>
      ) : null}

      {filteredProducts.length ? (
        <div className="grid gap-3">
          {filteredProducts.map((product) => {
            const selectedRating = ratings[product.id];
            const message = messages[product.id];
            const score = getAdjustedProductScore(product);
            const categoryLabel =
              categoryNames.get(product.categoryId) || product.categoryId;
            const priceSummary = formatPriceSummary(product);

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
                      {priceSummary ? ` · ${priceSummary}` : ""}
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
                        disabled={
                          submittingId === product.id ||
                          votesRemaining <= 0 ||
                          Boolean(selectedRating)
                        }
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
        Cada plato se puede puntuar una sola vez por dispositivo. Cada escaneo
        válido habilita 2 votos durante 24 horas.
      </p>
    </div>
  );
}
