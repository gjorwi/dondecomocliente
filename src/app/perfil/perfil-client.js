"use client";

import Link from "next/link";
import { ArrowRight, Heart, Info, Star, UserRound } from "lucide-react";
import { Pill } from "@/components/ui";
import { useSaved } from "@/components/saved-provider";

export default function ProfileClient() {
  const { savedIds } = useSaved();

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

      <section className="mt-6 flex items-center gap-3 rounded-[24px] bg-white p-4 shadow-sm">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-tint text-[28px]">
          <UserRound className="h-7 w-7 text-accent" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-ink">Invitado</p>
          <p className="text-xs text-muted">Acceso sin cuenta</p>
        </div>
        <Pill tone="beige">Público</Pill>
      </section>

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
          Puedes puntuar un plato que ya probaste. Es opcional, de 0 a 5
          estrellas y sin comentarios.
        </p>
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
