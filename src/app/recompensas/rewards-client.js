"use client";

import Link from "next/link";
import useSWR from "swr";
import {
  ArrowRight,
  Gift,
  History,
  Lock,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { GoogleLoginButton } from "@/components/google-login-button";
import { useClientAuth } from "@/components/auth-provider";
import { apiFetch } from "@/lib/api";
import { Pill } from "@/components/ui";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-VE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function RewardsClient() {
  const { user, ready } = useClientAuth();
  const { data: pointsData, isLoading: pointsLoading } = useSWR(
    user ? "/client/me/points" : null,
    apiFetch,
  );
  const { data: achievementsData, isLoading: achievementsLoading } = useSWR(
    user ? "/client/me/achievements" : null,
    apiFetch,
  );

  if (!ready || (user && (pointsLoading || achievementsLoading))) {
    return (
      <div className="mx-auto max-w-3xl rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
        Cargando recompensas…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Fidelidad
        </p>
        <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
          Tus recompensas
        </h1>
        <div className="mt-5 rounded-[28px] bg-white p-5 shadow-sm sm:p-6">
          <Pill tone="amber">Acceso requerido</Pill>
          <p className="mt-3 text-sm leading-6 text-muted">
            Inicia sesión para acumular puntos con tus puntuaciones y
            desbloquear logros.
          </p>
          <div className="mt-5">
            <GoogleLoginButton next="/recompensas" />
          </div>
        </div>
      </div>
    );
  }

  const points = pointsData?.points ?? user.points ?? 0;
  const history = pointsData?.history || [];
  const achievements = achievementsData?.achievements || [];
  const unlockedCount = achievements.filter(
    (achievement) => achievement.unlockedAt,
  ).length;

  return (
    <div className="mx-auto max-w-4xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Fidelidad
      </p>
      <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
        Tus recompensas
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Suma puntos, desbloquea insignias y canjéalos por cupones en tus locales
        favoritos.
      </p>

      <section className="mt-6 overflow-hidden rounded-[28px] bg-accent p-5 text-white shadow-md sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs text-white/70">Puntos disponibles</p>
            <p className="mt-1 font-display text-[52px] leading-none">
              {points}
            </p>
          </div>
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
            <Star className="h-7 w-7 fill-mustard text-mustard" />
          </span>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Pill tone="amber">
            {unlockedCount} de {achievements.length} logros
          </Pill>
          <Link
            href="/cupones"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-xs font-semibold text-accent transition hover:bg-white/90"
          >
            <Gift className="h-4 w-4" aria-hidden="true" />
            Ver cupones
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-[24px] leading-tight tracking-[-0.03em] text-ink">
              Logros
            </h2>
            <p className="mt-1 text-sm text-muted">
              Cada logro desbloqueado suma puntos e insignias a tu perfil.
            </p>
          </div>
          <Trophy className="h-6 w-6 text-mustard" aria-hidden="true" />
        </div>

        {achievements.length ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {achievements.map((achievement) => {
              const progress = Math.min(
                achievement.progress || 0,
                achievement.requirementValue,
              );
              const percent = Math.round(
                (progress / achievement.requirementValue) * 100,
              );
              const unlocked = Boolean(achievement.unlockedAt);

              return (
                <article
                  key={achievement.id}
                  className={`rounded-[24px] border p-4 shadow-sm ${
                    unlocked
                      ? "border-open/30 bg-green-tint"
                      : "border-line/70 bg-white/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-[24px] shadow-sm">
                      {unlocked ? (
                        achievement.icon
                      ) : (
                        <Lock className="h-5 w-5 text-muted" />
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <h3 className="text-sm font-semibold text-ink">
                          {achievement.title}
                        </h3>
                        {unlocked ? (
                          <Pill tone="open">Desbloqueado</Pill>
                        ) : (
                          <Pill tone="beige">En progreso</Pill>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted">
                        {achievement.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-[11px] font-semibold text-muted">
                      <span>
                        {progress} / {achievement.requirementValue}
                      </span>
                      <span className="inline-flex items-center gap-1 text-accent">
                        <Sparkles className="h-3.5 w-3.5" />
                        +{achievement.rewardPoints} pts
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line/60">
                      <div
                        className={`h-full rounded-full ${
                          unlocked ? "bg-open" : "bg-accent"
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 rounded-[24px] bg-soft p-6 text-center text-sm text-muted">
            Aún no hay logros configurados.
          </div>
        )}
      </section>

      <section className="mt-6">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5 text-accent" aria-hidden="true" />
          <h2 className="font-display text-[24px] leading-tight tracking-[-0.03em] text-ink">
            Historial de puntos
          </h2>
        </div>

        {history.length ? (
          <div className="mt-3 overflow-hidden rounded-[24px] border border-line/70 bg-white/70 shadow-sm">
            {history.map((transaction, index) => (
              <div
                key={transaction.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  index > 0 ? "border-t border-line" : ""
                }`}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-ink">
                    {transaction.description || "Movimiento de puntos"}
                  </span>
                  <span className="block text-[11px] text-muted">
                    {formatDate(transaction.createdAt)}
                  </span>
                </span>
                <span
                  className={`shrink-0 text-sm font-semibold ${
                    transaction.amount >= 0 ? "text-open" : "text-accent"
                  }`}
                >
                  {transaction.amount >= 0 ? "+" : ""}
                  {transaction.amount}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 rounded-[24px] bg-soft p-6 text-center text-sm text-muted">
            Todavía no tienes movimientos de puntos. Puntúa un plato para
            empezar.
          </div>
        )}
      </section>
    </div>
  );
}
