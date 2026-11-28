"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR, { useSWRConfig } from "swr";
import {
  Check,
  ChevronDown,
  Clock3,
  Gift,
  Loader2,
  MapPin,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { GoogleLoginButton } from "@/components/google-login-button";
import { useClientAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api";
import { getCurrentLocation } from "@/lib/geolocation";
import { useBusinesses, useCategories } from "@/lib/hooks";
import { Pill } from "@/components/ui";

const statusLabels = {
  acquired: "Adquirido",
  activated: "Activado",
  used: "Canjeado",
  expired: "Vencido",
  rejected: "Rechazado",
};

const statusTones = {
  acquired: "amber",
  activated: "accent",
  used: "open",
  expired: "beige",
  rejected: "red",
};

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-VE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function CouponStatus({ status }) {
  return (
    <Pill tone={statusTones[status] || "beige"}>
      {statusLabels[status] || status}
    </Pill>
  );
}

export default function CouponsClient() {
  const { user, ready } = useClientAuth();
  const { mutate: mutateGlobal } = useSWRConfig();
  const { categories } = useCategories();
  const { businesses } = useBusinesses();
  const [tab, setTab] = useState("available");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("todas");
  const [business, setBusiness] = useState("todos");
  const [maxPoints, setMaxPoints] = useState("");
  const [sort, setSort] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");
  const [messageError, setMessageError] = useState(false);

  const activeFilterCount =
    (category !== "todas" ? 1 : 0) +
    (business !== "todos" ? 1 : 0) +
    (maxPoints ? 1 : 0) +
    (sort ? 1 : 0);

  const clearFilters = () => {
    setCategory("todas");
    setBusiness("todos");
    setMaxPoints("");
    setSort("");
  };

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (category !== "todas") params.set("category", category);
    if (business !== "todos") params.set("business", business);
    if (maxPoints) params.set("maxPoints", maxPoints);
    if (sort) params.set("sort", sort);
    return params.toString();
  }, [business, category, maxPoints, query, sort]);

  const couponsKey =
    user && tab === "available"
      ? `/client/coupons${queryString ? `?${queryString}` : ""}`
      : null;
  const {
    data: couponsData,
    isLoading: couponsLoading,
    error: couponsError,
    mutate: mutateCoupons,
  } = useSWR(couponsKey, apiFetch);
  const {
    data: mineData,
    isLoading: mineLoading,
    error: mineError,
    mutate: mutateMine,
  } = useSWR(user ? "/client/me/coupons" : null, apiFetch, {
    refreshInterval: 30000,
  });

  if (!ready) {
    return (
      <div className="rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
        Cargando cupones…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Beneficios
        </p>
        <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
          Cupones
        </h1>
        <div className="mt-5 rounded-[28px] bg-white p-5 shadow-sm sm:p-6">
          <Pill tone="amber">Acceso requerido</Pill>
          <p className="mt-3 text-sm leading-6 text-muted">
            Inicia sesión para canjear tus puntos por cupones de los negocios y
            activarlos cuando estés en el local.
          </p>
          <div className="mt-5">
            <GoogleLoginButton next="/cupones" />
          </div>
        </div>
      </div>
    );
  }

  const coupons = couponsData?.coupons || [];
  const purchases = mineData?.purchases || [];
  const points = couponsData?.points ?? user.points ?? 0;
  const filtersActive = Boolean(query.trim() || category !== "todas" || business !== "todos" || maxPoints || sort);

  const acquireCoupon = async (coupon) => {
    if (busyId) return;
    setBusyId(coupon.id);
    setMessage("");
    setMessageError(false);
    try {
      const payload = await apiFetch(`/client/coupons/${coupon.id}/acquire`, {
        method: "POST",
      });
      await Promise.all([
        mutateCoupons(),
        mutateMine(),
        mutateGlobal("/auth/me"),
      ]);
      const achievementText = payload.achievementsUnlocked?.length
        ? ` Logro desbloqueado: ${payload.achievementsUnlocked
            .map((item) => item.title)
            .join(", ")}.`
        : "";
      setMessage(
        `Cupón adquirido y guardado en “Mis cupones”.${achievementText}`,
      );
    } catch (error) {
      setMessageError(true);
      setMessage(error.message || "No se pudo adquirir el cupón.");
    } finally {
      setBusyId("");
    }
  };

  const activateCoupon = async (purchase) => {
    if (busyId) return;
    setBusyId(purchase.id);
    setMessage("");
    setMessageError(false);
    try {
      const location = await getCurrentLocation();
      const payload = await apiFetch(
        `/client/me/coupons/${purchase.id}/activate`,
        {
          method: "POST",
          body: JSON.stringify({ location }),
        },
      );
      await mutateMine();
      setMessage(payload.message || "Cupón activado.");
    } catch (error) {
      setMessageError(true);
      setMessage(
        error.message ||
          "No pudimos activar el cupón. Debes estar cerca del negocio.",
      );
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Beneficios
          </p>
          <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
            Cupones
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Adquiere cupones con tus puntos, guárdalos en tu cuenta y actívalos
            cuando estés en el negocio.
          </p>
        </div>
        <div className="rounded-[20px] bg-accent px-4 py-3 text-white">
          <p className="text-[10px] uppercase tracking-[0.12em] text-white/70">
            Tus puntos
          </p>
          <p className="font-display text-2xl leading-none">{points}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setTab("available")}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
            tab === "available"
              ? "bg-ink text-white"
              : "bg-beige text-ink hover:bg-[#ebe0d4]"
          }`}
        >
          <Gift className="h-4 w-4" aria-hidden="true" />
          Disponibles
        </button>
        <button
          type="button"
          onClick={() => setTab("mine")}
          className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
            tab === "mine"
              ? "bg-ink text-white"
              : "bg-beige text-ink hover:bg-[#ebe0d4]"
          }`}
        >
          <Star className="h-4 w-4" aria-hidden="true" />
          Mis cupones
        </button>
      </div>

      {message ? (
        <div
          role="status"
          className={`mt-4 rounded-[20px] p-4 text-sm font-semibold leading-5 ${
            messageError
              ? "bg-accent-tint text-accent"
              : "bg-green-tint text-open"
          }`}
        >
          {message}
        </div>
      ) : null}

      {tab === "available" ? (
        <>
          <div className="mt-4 flex items-center gap-2">
            <label className="relative min-w-0 flex-1">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar cupón o negocio"
                className="min-h-11 w-full rounded-full border border-line bg-white pl-9 pr-3 text-sm text-ink shadow-sm outline-none focus:border-accent/60"
              />
            </label>
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              aria-expanded={filtersOpen}
              aria-controls="coupon-filters"
              className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition ${
                activeFilterCount
                  ? "border-accent/40 bg-accent-tint text-accent"
                  : "border-line bg-white text-ink shadow-sm hover:bg-soft"
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
                  filtersOpen ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          {filtersOpen ? (
            <div
              id="coupon-filters"
              className="mt-2 rounded-[24px] border border-line/70 bg-white p-3 shadow-sm"
            >
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="min-h-10 w-full rounded-full border border-line bg-soft px-3 text-xs font-semibold text-ink outline-none focus:border-accent/60"
                  aria-label="Filtrar por categoría"
                >
                  <option value="todas">Todas las categorías</option>
                  {categories.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <select
                  value={business}
                  onChange={(event) => setBusiness(event.target.value)}
                  className="min-h-10 w-full rounded-full border border-line bg-soft px-3 text-xs font-semibold text-ink outline-none focus:border-accent/60"
                  aria-label="Filtrar por negocio"
                >
                  <option value="todos">Todos los negocios</option>
                  {businesses.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <select
                  value={maxPoints}
                  onChange={(event) => setMaxPoints(event.target.value)}
                  className="min-h-10 w-full rounded-full border border-line bg-soft px-3 text-xs font-semibold text-ink outline-none focus:border-accent/60"
                  aria-label="Filtrar por puntos"
                >
                  <option value="">Cualquier costo</option>
                  <option value="20">Hasta 20 puntos</option>
                  <option value="50">Hasta 50 puntos</option>
                  <option value="100">Hasta 100 puntos</option>
                  <option value="200">Hasta 200 puntos</option>
                  <option value="500">Hasta 500 puntos</option>
                </select>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="min-h-10 w-full rounded-full border border-line bg-soft px-3 text-xs font-semibold text-ink outline-none focus:border-accent/60"
                  aria-label="Ordenar cupones"
                >
                  <option value="">Orden recomendado</option>
                  <option value="points_asc">Menor costo en puntos</option>
                  <option value="points_desc">Mayor costo en puntos</option>
                </select>
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 px-1">
                <p className="text-[11px] text-muted">
                  {activeFilterCount
                    ? `${activeFilterCount} ${
                        activeFilterCount === 1 ? "filtro activo" : "filtros activos"
                      }`
                    : "Sin filtros activos"}
                </p>
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
            </div>
          ) : null}

          {couponsLoading ? (
            <div className="mt-4 rounded-[24px] bg-soft p-6 text-center text-sm text-muted">
              Cargando cupones…
            </div>
          ) : couponsError ? (
            <div className="mt-4 rounded-[24px] bg-accent-tint p-6 text-center text-sm text-accent">
              {couponsError.message}
            </div>
          ) : coupons.length ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {coupons.map((coupon) => (
                <article
                  key={coupon.id}
                  className="flex flex-col rounded-[24px] border border-line/70 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-tint text-[26px]">
                      {coupon.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-sm font-semibold text-ink">
                        {coupon.title}
                      </h2>
                      <p className="mt-0.5 text-xs text-muted">
                        {coupon.business.name}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">
                      <Star className="h-3.5 w-3.5 fill-mustard text-mustard" />
                      {coupon.pointsCost}
                    </span>
                  </div>

                  <p className="mt-2 flex-1 text-xs leading-5 text-muted">
                    {coupon.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted">
                    <span>Stock: {coupon.stock}</span>
                    <span>·</span>
                    <span>Válido {coupon.validityDays} días</span>
                    <span>·</span>
                    <span>
                      Límite {coupon.perUserLimit} por cliente
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => acquireCoupon(coupon)}
                    disabled={!coupon.canAcquire || busyId === coupon.id}
                    className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold text-white transition hover:bg-[#b33a0d] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busyId === coupon.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Gift className="h-4 w-4" />
                    )}
                    {coupon.purchasedByUser >= coupon.perUserLimit
                      ? "Límite alcanzado"
                      : points < coupon.pointsCost
                        ? `Faltan ${coupon.pointsCost - points} puntos`
                        : `Adquirir por ${coupon.pointsCost} pts`}
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-[24px] bg-soft p-6 text-center text-sm text-muted">
              {filtersActive ? (
                <>
                  <p className="font-semibold text-ink">
                    No hay cupones con estos filtros.
                  </p>
                  <p className="mt-1 text-xs">
                    Prueba con otros filtros o limpia la búsqueda.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-ink">
                    Los negocios todavía no han publicado cupones.
                  </p>
                  <p className="mt-1 text-xs">
                    Mientras tanto, gana puntos puntuando los platos que
                    pruebes.
                  </p>
                  <Link
                    href="/recompensas"
                    className="mt-3 inline-flex min-h-9 items-center justify-center rounded-full bg-accent px-4 text-xs font-semibold text-white transition hover:bg-[#b33a0d]"
                  >
                    Ver cómo ganar puntos
                  </Link>
                </>
              )}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => mutateMine()}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-beige px-3 text-xs font-semibold text-ink"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Actualizar
            </button>
          </div>

          {mineLoading ? (
            <div className="mt-3 rounded-[24px] bg-soft p-6 text-center text-sm text-muted">
              Cargando tus cupones…
            </div>
          ) : mineError ? (
            <div className="mt-3 rounded-[24px] bg-accent-tint p-6 text-center text-sm text-accent">
              {mineError.message}
            </div>
          ) : purchases.length ? (
            <div className="mt-3 grid gap-3">
              {purchases.map((purchase) => (
                <article
                  key={purchase.id}
                  className="rounded-[24px] border border-line/70 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-tint text-[26px]">
                      {purchase.coupon.emoji}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold text-ink">
                          {purchase.coupon.title}
                        </h2>
                        <CouponStatus status={purchase.status} />
                      </div>
                      <p className="mt-0.5 text-xs text-muted">
                        {purchase.business.name}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        {purchase.pointsSpent} puntos · Adquirido el{" "}
                        {formatDate(purchase.acquiredAt)}
                      </p>
                      <p className="text-[11px] text-muted">
                        Vence el {formatDate(purchase.expiresAt)}
                      </p>
                    </div>
                  </div>

                  {purchase.status === "activated" ? (
                    <div className="mt-3 flex items-start gap-2 rounded-2xl bg-green-tint p-3 text-xs leading-5 text-open">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      Activado. Muestra esta pantalla en el negocio para que
                      acepten el canje.
                    </div>
                  ) : null}

                  {purchase.status === "acquired" ? (
                    <button
                      type="button"
                      onClick={() => activateCoupon(purchase)}
                      disabled={busyId === purchase.id}
                      className="mt-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-accent px-4 text-xs font-semibold text-white transition hover:bg-[#b33a0d] disabled:opacity-50"
                    >
                      {busyId === purchase.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MapPin className="h-4 w-4" />
                      )}
                      Activar en el negocio
                    </button>
                  ) : null}

                  {purchase.status === "used" ? (
                    <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-open">
                      <Check className="h-4 w-4" /> Canje aceptado por el negocio
                    </p>
                  ) : null}

                  {purchase.status === "expired" ||
                  purchase.status === "rejected" ? (
                    <p className="mt-3 inline-flex items-center gap-1 text-xs text-muted">
                      <Clock3 className="h-4 w-4" /> Este cupón ya no está
                      disponible.
                    </p>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-[24px] bg-soft p-6 text-center text-sm text-muted">
              Todavía no tienes cupones. Explora los disponibles y adquiere uno
              con tus puntos.
            </div>
          )}
        </>
      )}
    </div>
  );
}
