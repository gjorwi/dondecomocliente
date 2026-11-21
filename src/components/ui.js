import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Search,
  Star,
} from "lucide-react";
import { getBusinessById } from "@/lib/mock-data";
import {
  formatScore,
  getAdjustedProductScore,
  getBusinessMetrics,
  getCategoryRanking,
} from "@/lib/scoring";

const pillTones = {
  beige: "bg-beige text-ink",
  accent: "bg-accent text-white",
  open: "bg-green-tint text-open",
  amber: "bg-amber-tint text-[#6a4700]",
  dark: "bg-ink text-white",
};

export function Pill({ children, tone = "beige", className = "" }) {
  return (
    <span
      className={`inline-flex min-h-6 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-none ${pillTones[tone] || pillTones.beige} ${className}`}
    >
      {children}
    </span>
  );
}

export function CardGrid({ children, className = "" }) {
  return (
    <div
      className={`grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionTitle({ title, description, action, href }) {
  return (
    <div className="mb-3 mt-8 flex items-end justify-between gap-3">
      <div>
        <h2 className="font-display text-[24px] leading-tight tracking-[-0.03em] text-ink">
          {title}
        </h2>
        {description ? (
          <p className="mt-1 text-sm leading-5 text-muted">{description}</p>
        ) : null}
      </div>
      {action && href ? (
        <Link
          href={href}
          className="flex shrink-0 items-center gap-1 text-sm font-semibold text-accent hover:underline"
        >
          {action}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

export function RatingLine({ score, count, compact = false }) {
  return (
    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-ink">
      <Star
        className="h-4 w-4 fill-mustard text-mustard"
        aria-hidden="true"
      />
      {formatScore(score)}
      {typeof count === "number" ? (
        <span className="font-normal text-muted">
          · {count}
          {compact ? "" : " puntuaciones"}
        </span>
      ) : null}
    </span>
  );
}

export function SearchField({
  value,
  onChange,
  onSubmit,
  placeholder = "Busca un plato o establecimiento",
  buttonLabel = "Buscar",
  showButton = true,
}) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit?.();
      }}
      className="flex min-h-[58px] items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-4 shadow-sm"
    >
      <Search className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="px-1 text-xl leading-none text-muted hover:text-ink"
          aria-label="Limpiar búsqueda"
        >
          ×
        </button>
      ) : null}
      {showButton ? (
        <button
          type="submit"
          className="min-h-11 shrink-0 rounded-full bg-accent px-4 text-sm font-semibold text-white transition hover:bg-[#b33a0d]"
        >
          {buttonLabel}
        </button>
      ) : null}
    </form>
  );
}

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-accent text-white hover:bg-[#b33a0d]",
    secondary: "bg-beige text-ink hover:bg-[#ebe0d4]",
    outline: "border border-line bg-white text-ink hover:bg-soft",
  };

  return (
    <button
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export function BackLink({ href, label = "Volver" }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex min-h-11 items-center gap-1.5 rounded-full pr-3 text-sm font-semibold text-ink transition hover:text-accent"
    >
      <ChevronLeft className="h-5 w-5 text-accent" aria-hidden="true" />
      {label}
    </Link>
  );
}

export function CategoryCard({ category }) {
  const fallbackTop = getCategoryRanking(category.id)[0];
  const hasTopField = Object.prototype.hasOwnProperty.call(category, "top");
  const top = hasTopField ? category.top?.product : fallbackTop;
  const business = hasTopField
    ? category.top?.business
    : top
      ? getBusinessById(top.businessId)
      : null;
  const score = hasTopField
    ? category.top?.score
    : top
      ? getAdjustedProductScore(top)
      : null;
  const ratingsCount = hasTopField
    ? category.top?.ratingsCount ?? 0
    : top?.ratingsCount ?? 0;

  return (
    <Link
      href={`/categoria/${category.id}`}
      className="group flex h-[216px] flex-col rounded-[24px] border border-line/70 bg-white/65 p-4 shadow-sm backdrop-blur-[2px] transition hover:-translate-y-0.5 hover:border-accent/40 hover:bg-white/80 hover:shadow-md"
    >
      <div className="flex items-center gap-2.5">
        <Image
          src={category.image}
          alt=""
          width={44}
          height={44}
          className="h-11 w-11 shrink-0 rounded-2xl object-cover"
        />
        <h3 className="min-w-0 text-[15px] font-semibold leading-5 text-ink">
          {category.label}
        </h3>
      </div>

      <div className="mt-3 flex-1">
        {top ? (
          <>
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-accent">
              Mejor plato
            </p>
            <p className="mt-1 line-clamp-2 text-[15px] font-semibold leading-5 text-ink">
              {top.name}
            </p>
            <p className="mt-1 line-clamp-1 text-[12px] leading-4 text-muted">
              {business?.name}
            </p>
          </>
        ) : (
          <p className="text-[12px] leading-4 text-muted">
            Aún no hay suficientes puntuaciones.
          </p>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line/60 pt-2.5">
        {top ? (
          <RatingLine score={score} count={ratingsCount} compact />
        ) : (
          <span className="text-[11px] font-semibold text-muted">Sin datos</span>
        )}
        <span className="inline-flex shrink-0 items-center gap-1 text-[11px] font-semibold text-accent">
          Ver Top 3
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export function BusinessCard({ business }) {
  const metrics = getBusinessMetrics(business.id);
  const hasScore = Object.prototype.hasOwnProperty.call(business, "score");
  const score = hasScore ? business.score : metrics.score;
  const ratingsCount = hasScore ? business.ratingsCount : metrics.ratingsCount;

  return (
    <Link
      href={`/local/${business.id}`}
      className="group flex h-[300px] flex-col rounded-[24px] border border-line/70 bg-white/65 p-3 shadow-sm backdrop-blur-[2px] transition hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-md"
    >
      <div className="flex h-28 shrink-0 items-center justify-center rounded-[18px] bg-accent-tint text-[54px]">
        {business.emoji || "🍽️"}
      </div>
      <div className="mt-3 flex min-h-0 flex-1 flex-col">
        <div className="flex items-start gap-1.5">
          <h3 className="line-clamp-2 text-[15px] font-semibold leading-5 text-ink">
            {business.name}
          </h3>
          {business.isVerified ? (
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-open"
              aria-label="Datos verificados"
            />
          ) : null}
        </div>
        <p className="mt-1 text-[12px] leading-4 text-muted">
          {business.zone} · Coro
        </p>
        <p className="mt-1 line-clamp-2 text-[12px] leading-4 text-muted">
          {business.description}
        </p>
        <div className="mt-auto flex items-center justify-between gap-1.5 pt-2">
          <RatingLine score={score} count={ratingsCount} compact />
          <Pill tone={business.isOpen ? "open" : "dark"}>
            {business.isOpen ? "Abierto" : "Cerrado"}
          </Pill>
        </div>
      </div>
    </Link>
  );
}

const promoTones = {
  accent: { card: "bg-accent-tint", badge: "bg-accent" },
  amber: { card: "bg-amber-tint", badge: "bg-[#b7791f]" },
  green: { card: "bg-green-tint", badge: "bg-open" },
};

export function PromoCard({ promotion }) {
  const business = getBusinessById(promotion.businessId);
  const tone = promoTones[promotion.tone] || promoTones.accent;

  return (
    <Link
      href={`/plato/${promotion.productId}`}
      className={`group flex w-[86vw] max-w-[420px] shrink-0 snap-start items-center gap-3 rounded-[20px] border border-line/70 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:w-[420px] ${tone.card}`}
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-[30px]">
        {promotion.emoji}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-[15px] font-semibold leading-5 text-ink">
          {promotion.title}
        </h3>
        <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-semibold leading-4 text-white ${tone.badge}`}
          >
            {promotion.badge}
          </span>
          <p className="truncate text-[11px] leading-4 text-muted">
            {business?.name || "Establecimiento"} · {promotion.note}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <div className="text-right">
          <p className="font-display text-lg leading-none tracking-[-0.03em] text-ink">
            ${promotion.price.toFixed(2)}
          </p>
          {typeof promotion.originalPrice === "number" ? (
            <p className="mt-0.5 text-[10px] leading-3 text-muted line-through">
              ${promotion.originalPrice.toFixed(2)}
            </p>
          ) : null}
        </div>
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-ink transition group-hover:bg-accent group-hover:text-white">
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function DishCard({ product }) {
  const business = getBusinessById(product.businessId);
  const score = getAdjustedProductScore(product);

  return (
    <Link
      href={`/plato/${product.id}`}
      className="group flex h-[300px] flex-col rounded-[24px] border border-line/70 bg-white/65 p-3 shadow-sm backdrop-blur-[2px] transition hover:-translate-y-0.5 hover:bg-white/80 hover:shadow-md"
    >
      <div className="relative flex h-32 shrink-0 items-center justify-center rounded-[18px] bg-amber-tint text-[54px]">
        {product.emoji || "🍽️"}
        {product.isAvailable === false ? (
          <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-1 text-[10px] font-semibold text-white">
            No disponible hoy
          </span>
        ) : null}
      </div>
      <div className="mt-3 flex min-h-0 flex-1 flex-col">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-5 text-ink">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-1 text-[12px] leading-4 text-muted">
          {product.businessName || business?.name} ·{" "}
          {business?.zone || "Coro"}
        </p>
        <div className="mt-auto flex items-center justify-between gap-1.5 pt-2">
          <RatingLine
            score={score}
            count={product.ratingsCount}
            compact
          />
          {typeof product.price === "number" ? (
            <span className="text-[13px] font-semibold text-ink">
              ${product.price.toFixed(2)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export function DishRow({ product, rank }) {
  const business = getBusinessById(product.businessId);
  const businessName = product.businessName || business?.name;
  const score = getAdjustedProductScore(product);

  return (
    <Link
      href={`/plato/${product.id}`}
      className="flex items-center gap-3 py-3.5 transition hover:bg-white/60"
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          rank === 1 ? "bg-accent text-white" : "bg-beige text-ink"
        }`}
      >
        {rank}
      </span>
      <span className="w-8 shrink-0 text-center text-[26px]">
        {product.emoji}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-ink">{product.name}</p>
        <p className="truncate text-xs text-muted">{businessName}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-ink">
        <Star className="h-4 w-4 fill-mustard text-mustard" aria-hidden="true" />
        {formatScore(score)}
      </div>
    </Link>
  );
}

export function EmptyState({
  title,
  description,
  emoji = "🍽️",
  action,
  href,
}) {
  return (
    <div className="rounded-[24px] bg-soft px-6 py-10 text-center">
      <div className="text-4xl">{emoji}</div>
      <h3 className="mt-3 text-lg font-semibold text-ink">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-sm text-sm leading-5 text-muted">
        {description}
      </p>
      {action && href ? (
        <Link
          href={href}
          className="mt-4 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-accent px-5 text-sm font-semibold text-white"
        >
          {action}
          <ArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
