"use client";

import Link from "next/link";
import useSWR from "swr";
import { ArrowRight, Gift, Sparkles, Star } from "lucide-react";
import { useClientAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api";

export function HomeCoupons() {
  const { user, ready } = useClientAuth();
  const { data, isLoading } = useSWR(
    user ? "/client/coupons?sort=points_asc" : null,
    apiFetch,
  );

  if (!ready) return null;

  if (!user) {
    return (
      <section className="mt-8 flex flex-col gap-4 rounded-[28px] bg-amber-tint p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#8a5a00] shadow-sm">
            <Gift className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a5a00]">
              Recompensas
            </p>
            <h2 className="mt-1 font-display text-[24px] leading-tight tracking-[-0.03em] text-ink">
              Gana puntos y canjéalos por cupones
            </h2>
            <p className="mt-1 max-w-xl text-xs leading-5 text-[#6a4700]">
              Puntúa los platos que pruebes y cambia tus puntos por beneficios
              en los negocios de Coro.
            </p>
          </div>
        </div>
        <Link
          href="/login?next=/cupones"
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-ink/90"
        >
          Iniciar sesión
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </section>
    );
  }

  const coupons = data?.coupons || [];
  const points = data?.points ?? user.points ?? 0;

  return (
    <section className="mt-8 rounded-[28px] bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-tint text-open">
            <Gift className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              Beneficios
            </p>
            <h2 className="mt-0.5 font-display text-[24px] leading-tight tracking-[-0.03em] text-ink">
              Cupones para ti
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-beige px-3 text-xs font-semibold text-ink">
            <Star className="h-3.5 w-3.5 fill-mustard text-mustard" />
            {points} puntos
          </span>
          <Link
            href="/cupones"
            className="inline-flex min-h-9 items-center gap-1 rounded-full bg-accent px-4 text-xs font-semibold text-white transition hover:bg-[#b33a0d]"
          >
            Ver cupones
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <p className="mt-2 text-xs leading-5 text-muted">
        Gana puntos puntuando platos y adquiere cupones para usar en el local.
        Puedes llevarlos guardados y activarlos cuando estés allí.
      </p>

      {isLoading ? (
        <p className="mt-4 rounded-2xl bg-soft p-4 text-center text-xs text-muted">
          Cargando cupones…
        </p>
      ) : coupons.length ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {coupons.slice(0, 3).map((coupon) => (
            <Link
              key={coupon.id}
              href="/cupones"
              className="group flex items-center gap-3 rounded-2xl border border-line/70 bg-soft p-3 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[24px] shadow-sm">
                {coupon.emoji}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">
                  {coupon.title}
                </span>
                <span className="block truncate text-[11px] text-muted">
                  {coupon.business.name}
                </span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-accent">
                <Star className="h-3 w-3 fill-mustard text-mustard" />
                {coupon.pointsCost}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-2xl bg-soft p-4 text-xs leading-5 text-muted">
          <Sparkles className="h-4 w-4 shrink-0 text-accent" />
          <span>
            Los negocios todavía no han publicado cupones. Mientras tanto, gana
            puntos puntuando platos.
          </span>
          <Link
            href="/recompensas"
            className="font-semibold text-accent hover:underline"
          >
            Cómo ganar puntos
          </Link>
        </div>
      )}
    </section>
  );
}
