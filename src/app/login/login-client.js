"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BadgeCheck, Heart, Star } from "lucide-react";
import { BackLink, Pill } from "@/components/ui";
import { GoogleLoginButton } from "@/components/google-login-button";
import { useClientAuth } from "@/components/auth-provider";

const benefits = [
  {
    icon: Heart,
    title: "Guarda tus favoritos",
    description: "Tus locales y platos guardados te siguen en cualquier dispositivo.",
  },
  {
    icon: Star,
    title: "Puntúa lo que probaste",
    description: "Tu opinión ayuda a construir el Top 3 de cada categoría.",
  },
  {
    icon: BadgeCheck,
    title: "Una cuenta, toda tu actividad",
    description: "Tus favoritos y puntuaciones quedan asociados a tu perfil.",
  },
];

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, ready } = useClientAuth();
  const requestedNext = searchParams.get("next") || "/perfil";
  const next = requestedNext.startsWith("/") ? requestedNext : "/perfil";

  useEffect(() => {
    if (ready && user) router.replace(next);
  }, [next, ready, router, user]);

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/" />

      <section className="rounded-[30px] bg-accent px-5 py-8 text-white sm:px-8 sm:py-10">
        <Pill tone="amber">Tu cuenta</Pill>
        <h1 className="mt-3 max-w-lg font-display text-[34px] leading-[1.05] tracking-[-0.04em] sm:text-[42px]">
          Inicia sesión para puntuar y guardar
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-white/80">
          Para cuidar la transparencia del ranking, las puntuaciones y los
          favoritos necesitan una cuenta verificada.
        </p>
      </section>

      <section className="mt-4 rounded-[28px] bg-white p-5 shadow-sm sm:p-6">
        <GoogleLoginButton next={next} />
        <p className="mt-4 text-center text-[11px] leading-5 text-muted">
          Solo usaremos tu nombre, correo y foto de perfil para identificar tu
          cuenta. No publicamos nada en tu nombre.
        </p>
      </section>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {benefits.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-[24px] bg-soft p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-accent shadow-sm">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink">{title}</p>
            <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
