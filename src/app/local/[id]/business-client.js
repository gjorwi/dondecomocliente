"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BadgeCheck,
  Clock3,
  Heart,
  MapPin,
  MessageCircle,
  Phone,
  Star,
} from "lucide-react";
import {
  BackLink,
  CardGrid,
  DishCard,
  EmptyState,
  Pill,
  SectionTitle,
} from "@/components/ui";
import { formatScore } from "@/lib/scoring";
import { useBusiness } from "@/lib/hooks";
import { useSaved } from "@/components/saved-provider";

function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}

function DeliveryRates({ business }) {
  const shortFee = business.deliveryShortFee;
  const longFee = business.deliveryLongFee;
  const freeFrom = business.freeDeliveryFrom;
  const hasRates =
    typeof shortFee === "number" ||
    typeof longFee === "number" ||
    typeof freeFrom === "number";

  if (!hasRates) return null;

  return (
    <div className="mt-2 rounded-2xl bg-soft p-3 text-xs leading-5 text-muted">
      <p className="font-semibold text-ink">Tarifas de delivery</p>
      {typeof shortFee === "number" ? (
        <p className="mt-0.5">Delivery corto: {formatMoney(shortFee)}</p>
      ) : null}
      {typeof longFee === "number" ? (
        <p className="mt-0.5">Delivery largo: {formatMoney(longFee)}</p>
      ) : null}
      {typeof freeFrom === "number" ? (
        <p className="mt-0.5 text-open">
          Delivery gratis en compras desde {formatMoney(freeFrom)}
        </p>
      ) : null}
    </div>
  );
}

export default function BusinessClient({ businessId }) {
  const { business, products, isLoading } = useBusiness(businessId);
  const { isSaved, toggleSaved } = useSaved();

  if (isLoading && !business) {
    return (
      <div className="rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
        Cargando establecimiento…
      </div>
    );
  }

  if (!business) {
    return (
      <div>
        <BackLink href="/" />
        <EmptyState
          title="No encontramos este establecimiento"
          description="Puede que ya no esté disponible en la demo."
          action="Volver a explorar"
          href="/"
        />
      </div>
    );
  }

  const savedKey = `local:${business.id}`;
  const saved = isSaved(savedKey);
  const whatsappUrl = `https://wa.me/${business.whatsapp}?text=${encodeURIComponent(
    `Hola, vi ${business.name} en comidasTop. ¿Me comparten información del menú?`,
  )}`;
  const coordinates = business.location;
  const hasCoordinates =
    typeof coordinates?.lat === "number" &&
    Number.isFinite(coordinates.lat) &&
    typeof coordinates?.lng === "number" &&
    Number.isFinite(coordinates.lng);
  const mapQuery = hasCoordinates
    ? `${coordinates.lat},${coordinates.lng}`
    : business.address;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    mapQuery,
  )}`;
  const businessArea = [business.municipality, business.parish, business.sector]
    .filter(Boolean)
    .join(" · ");
  const metrics = {
    score: business.score,
    ratingsCount: business.ratingsCount ?? 0,
    ratedProducts: business.ratedProducts ?? 0,
    activeProducts: business.activeProducts ?? products.length,
    categories: business.categories || [],
  };
  const recognition = business.recognition;

  return (
    <div>
      <BackLink href="/" />

      <section className="relative h-48 overflow-hidden rounded-[30px] bg-accent-tint sm:h-56">
        {business.coverImage ? (
          <Image
            src={business.coverImage}
            alt={`Portada de ${business.name}`}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 1152px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-[92px] sm:text-[110px]">
            {business.emoji || "🍽️"}
          </div>
        )}
        {business.coverImage ? (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
        ) : null}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {business.isVerified ? (
            <Pill tone="open">
              <BadgeCheck className="mr-1 h-3.5 w-3.5" />
              Datos verificados
            </Pill>
          ) : (
            <Pill>Datos por verificar</Pill>
          )}
          <Pill tone={business.isOpen ? "open" : "dark"}>
            {business.isOpen ? "Abierto ahora" : "Cerrado"}
          </Pill>
        </div>
        <button
          type="button"
          onClick={() => toggleSaved(savedKey)}
          aria-label={saved ? "Quitar de favoritos" : "Añadir a favoritos"}
          className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm transition hover:scale-105"
        >
          <Heart
            className={`h-5 w-5 ${
              saved ? "fill-accent text-accent" : "text-ink"
            }`}
          />
        </button>
      </section>

      <div className="mt-5">
        <h1 className="font-display text-[36px] leading-[1.05] tracking-[-0.04em] text-ink sm:text-[44px]">
          {business.name}
        </h1>
        <p className="mt-1.5 text-sm text-muted">
          {business.category}
          {businessArea ? ` · ${businessArea}` : business.zone ? ` · ${business.zone}` : ""}
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] bg-soft p-5">
          <p className="text-xs text-muted">Puntuación del establecimiento</p>
          <div className="mt-1 flex items-end gap-1">
            <Star className="mb-1.5 h-6 w-6 fill-mustard text-mustard" />
            <span className="font-display text-[38px] leading-none text-ink">
              {formatScore(metrics.score)}
            </span>
            <span className="mb-1 text-sm text-muted">/ 5</span>
          </div>
          <div className="mt-3 h-px bg-line" />
          <p className="mt-3 text-xs leading-5 text-muted">
            Calculada con {metrics.ratedProducts} de {metrics.activeProducts}{" "}
            platos puntuados y {metrics.ratingsCount} calificaciones. El local
            no se puntúa directamente.
          </p>
        </div>

        <div className="rounded-[24px] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-open" />
            <p className="text-sm font-semibold text-ink">
              {business.isOpen ? "Abierto ahora" : "Cerrado ahora"}
            </p>
          </div>
          {business.hours ? (
            <p className="mt-1 text-xs text-muted">{business.hours}</p>
          ) : (
            <p className="mt-1 text-xs text-muted">
              Horario no indicado por el establecimiento.
            </p>
          )}
          <div className="mt-2">
            <Pill tone={business.hasDelivery ? "open" : "beige"}>
              {business.hasDelivery
                ? "Con servicio de delivery"
                : "Sin servicio de delivery"}
            </Pill>
          </div>
          {business.hasDelivery &&
          (typeof business.deliveryShortFee === "number" ||
            typeof business.deliveryLongFee === "number") ? (
            <p className="mt-2 text-[11px] leading-4 text-muted">
              {typeof business.deliveryShortFee === "number"
                ? `Corto ${formatMoney(business.deliveryShortFee)}`
                : null}
              {typeof business.deliveryShortFee === "number" &&
              typeof business.deliveryLongFee === "number"
                ? " · "
                : null}
              {typeof business.deliveryLongFee === "number"
                ? `Largo ${formatMoney(business.deliveryLongFee)}`
                : null}
            </p>
          ) : null}
          {business.hasDelivery &&
          typeof business.freeDeliveryFrom === "number" ? (
            <p className="mt-1 text-[11px] font-semibold leading-4 text-open">
              Gratis desde {formatMoney(business.freeDeliveryFrom)}
            </p>
          ) : null}
          <div className="mt-4 flex items-start gap-2 text-xs text-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
            <div>
              <p>{business.address}</p>
              {business.locationReference ? (
                <p className="mt-1">Referencia: {business.locationReference}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {recognition ? (
        <div className="mt-3 flex gap-3 rounded-[24px] bg-amber-tint p-4">
          <span className="text-[28px]">🏅</span>
          <div>
            <p className="text-sm font-semibold text-[#5c3d00]">
              Reconocimiento de comidasTop
            </p>
            <p className="mt-1 text-xs text-[#6a4700]">
              Top {recognition.position} en{" "}
              {String(recognition.category || "").toLowerCase()} ·{" "}
              {recognition.productName}
            </p>
            <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-[#8a5a00]">
              Distintivo generado por el sistema
            </p>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-[#b33a0d]"
        >
          <MessageCircle className="h-4 w-4" />
          Contactar por WhatsApp
        </a>
        <a
          href={`tel:${business.phone.replace(/[^0-9+]/g, "")}`}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-beige px-5 text-sm font-semibold text-ink transition hover:bg-[#ebe0d4]"
        >
          <Phone className="h-4 w-4" />
          Llamar
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-beige px-5 text-sm font-semibold text-ink transition hover:bg-[#ebe0d4]"
        >
          <MapPin className="h-4 w-4" />
          Cómo llegar
        </a>
      </div>

      <SectionTitle
        title="Menú puntuado"
        description="Las puntuaciones corresponden a cada plato; no hay reseñas escritas."
      />
      {products.length ? (
        <CardGrid>
          {products.map((product) => (
            <DishCard key={product.id} product={product} />
          ))}
        </CardGrid>
      ) : (
        <EmptyState
          title="Menú en preparación"
          description="Este establecimiento todavía no publicó platos."
        />
      )}

      {metrics.categories.length > 0 ? (
        <>
          <SectionTitle title="Por categoría" />
          <div className="grid gap-2 sm:grid-cols-2">
            {metrics.categories.map((category) => (
              <div
                key={category.id}
                className="flex min-h-12 items-center justify-between rounded-2xl bg-soft px-4"
              >
                <span className="text-sm text-muted">{category.label}</span>
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
                  <Star className="h-4 w-4 fill-mustard text-mustard" />
                  {formatScore(category.score)}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}

      <div className="mt-6 rounded-[24px] bg-white p-5 shadow-sm">
        <h2 className="font-display text-xl tracking-[-0.03em] text-ink">
          Sobre el local
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {business.description}
        </p>
        <p className="mt-3 text-xs text-muted">{business.address}</p>
        {business.locationReference ? (
          <p className="mt-1 text-xs text-muted">
            Referencia: {business.locationReference}
          </p>
        ) : null}
        {businessArea ? (
          <p className="mt-1 text-xs text-muted">{businessArea}</p>
        ) : null}
        <p className="mt-1 text-xs text-muted">
          {business.hasDelivery
            ? "Ofrece servicio de delivery."
            : "No ofrece servicio de delivery."}
        </p>
        {business.hasDelivery ? <DeliveryRates business={business} /> : null}
        <p className="mt-1 text-xs text-muted">{business.phone}</p>
      </div>

      <div className="mt-5 flex justify-center">
        <Link
          href="/buscar"
          className="text-sm font-semibold text-accent hover:underline"
        >
          Seguir explorando Coro
        </Link>
      </div>
    </div>
  );
}
