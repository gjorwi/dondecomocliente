"use client";

import Link from "next/link";
import { ArrowRight, Heart, Info, LogOut, Star, UserRound } from "lucide-react";
import { GoogleLoginButton } from "@/components/google-login-button";
import { useClientAuth } from "@/components/auth-provider";
import { useSaved } from "@/components/saved-provider";
import { Pill } from "@/components/ui";

function initials(name = "") {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function ProfileClient() {
  const { savedIds } = useSaved();
  const { user, ready, logout } = useClientAuth();

  if (!ready) {
    return (
      <div className="mx-auto max-w-3xl rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
        Cargando tu perfil…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Tu espacio
      </p>
      <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
        Tu perfil
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Una forma sencilla de encontrar dónde comer en Coro.
      </p>

      <section className="mt-6 flex flex-wrap items-center gap-3 rounded-[24px] bg-white p-4 shadow-sm">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-amber-tint text-[22px] font-semibold text-accent">
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
          ) : user ? (
            initials(user.name)
          ) : (
            <UserRound className="h-7 w-7 text-accent" />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">{user?.name || "Invitado"}</p>
          <p className="truncate text-xs text-muted">
            {user?.email || "Acceso sin cuenta"}
          </p>
        </div>

        {user ? (
          <div className="flex items-center gap-2">
            <Pill tone="beige">
              {user.authProvider === "google" ? "Google" : "Cuenta"}
            </Pill>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-soft px-3 text-xs font-semibold text-muted transition hover:bg-beige hover:text-ink"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Salir
            </button>
          </div>
        ) : (
          <Pill tone="beige">Público</Pill>
        )}
      </section>

      {!user ? (
        <section className="mt-4 rounded-[24px] bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-ink">
            Inicia sesión para personalizar tu experiencia
          </p>
          <p className="mt-1 text-xs leading-5 text-muted">
            Necesitas una cuenta para puntuar platos y guardar favoritos.
          </p>
          <div className="mt-4">
            <GoogleLoginButton next="/perfil" />
          </div>
        </section>
      ) : null}

      <section className="mt-4 rounded-[24px] bg-soft p-5">
        <h2 className="font-display text-xl tracking-[-0.03em] text-ink">
          Tu actividad
        </h2>
        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="inline-flex items-center gap-2 text-sm text-ink">
            <Heart className="h-4 w-4 text-accent" />
            Platos y locales favoritos
          </span>
          <span className="font-display text-2xl text-accent">
            {savedIds.length}
          </span>
        </div>
        <div className="my-4 h-px bg-line" />
        <p className="text-xs leading-5 text-muted">
          {user
            ? "Tus favoritos se sincronizan con tu cuenta."
            : "Inicia sesión para guardar tus favoritos y llevarlos contigo."}
        </p>
        {user ? (
          <Link
            href="/favoritos"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
          >
            Ver mis favoritos
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        ) : null}
      </section>

      <section className="mt-4 rounded-[24px] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-mustard text-mustard" />
          <h2 className="font-display text-xl tracking-[-0.03em] text-ink">
            Cómo se calcula
          </h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-muted">
          Cada plato obtiene una puntuación con las calificaciones disponibles.
          La puntuación del establecimiento se calcula con sus platos puntuados;
          no existe una calificación directa del local.
        </p>
        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-amber-tint p-3 text-xs leading-5 text-[#6a4700]">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          Los rankings muestran platos con suficientes datos para evitar que una
          sola calificación determine el Top 3.
        </div>
      </section>

      <Link
        href="/"
        className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-[#b33a0d]"
      >
        Volver a explorar
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
