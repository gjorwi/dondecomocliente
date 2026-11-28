"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Gift,
  Heart,
  Home,
  MapPin,
  ScanLine,
  Search,
  Star,
  UserRound,
} from "lucide-react";
import { PendingVoteButton } from "@/components/pending-vote-button";
import { useClientAuth } from "@/components/auth-provider";

const navigation = [
  { href: "/", label: "Explorar", icon: Home },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/cupones", label: "Cupones", icon: Gift },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

// La barra inferior mantiene cuatro pestañas alrededor del botón de escaneo.
// Cupones queda accesible desde el header, el inicio, el perfil y el footer.
const mobileNavigation = navigation.filter(({ href }) => href !== "/cupones");

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function AppShell({ children }) {
  const pathname = usePathname();
  const { user } = useClientAuth();
  const points = user?.points ?? 0;
  const scanActive = isActive(pathname, "/escanear");

  const renderTab = ({ href, label, icon: Icon }) => {
    const active = isActive(pathname, href);
    return (
      <Link
        key={href}
        href={href}
        className={`flex min-h-[58px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-semibold transition ${
          active
            ? "bg-accent text-white"
            : "text-muted hover:bg-soft hover:text-ink"
        }`}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
        {label}
      </Link>
    );
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <Link
            href="/"
            aria-label="comidasTop, ir al inicio"
            className="flex shrink-0 items-center gap-1.5 font-display text-[24px] leading-none tracking-[-0.055em] sm:gap-2 sm:text-[26px]"
          >
            <Image
              src="/logoreal.jpeg"
              alt=""
              width={40}
              height={40}
              priority
              className="h-11 w-11 shrink-0 rounded-full object-contain sm:h-[52px] sm:w-[52px]"
            />
            <span>
              <span className="text-ink">comidas</span>
              <span className="text-accent">Top</span>
            </span>
          </Link>

          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-1 md:flex"
          >
            {navigation.map(({ href, label, icon: Icon }) => {
              const active = isActive(pathname, href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-semibold transition ${
                    active
                      ? "bg-accent text-white"
                      : "text-muted hover:bg-beige hover:text-ink"
                  }`}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  {label}
                </Link>
              );
            })}
            {user ? (
              <Link
                href="/recompensas"
                title="Tus puntos"
                aria-label={`Tienes ${points} puntos. Ver recompensas`}
                className="ml-1 flex min-h-10 items-center gap-1.5 rounded-full bg-beige px-3 text-sm font-semibold text-ink transition hover:bg-amber-tint"
              >
                <Star
                  className="h-4 w-4 shrink-0 fill-mustard text-mustard"
                  aria-hidden="true"
                />
                {points}
              </Link>
            ) : null}
            <Link
              href="/escanear"
              aria-label="Escanear código QR del local"
              className={`ml-1 flex h-10 w-10 items-center justify-center rounded-full transition ${
                scanActive
                  ? "bg-accent text-white"
                  : "bg-beige text-accent hover:bg-accent-tint"
              }`}
            >
              <ScanLine className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 md:hidden">
            {user ? (
              <Link
                href="/recompensas"
                title="Tus puntos"
                aria-label={`Tienes ${points} puntos. Ver recompensas`}
                className="flex min-h-10 items-center gap-1 rounded-full bg-beige px-3 text-sm font-semibold text-ink transition hover:bg-amber-tint"
              >
                <Star
                  className="h-4 w-4 shrink-0 fill-mustard text-mustard"
                  aria-hidden="true"
                />
                {points}
              </Link>
            ) : null}
            <div className="hidden min-h-10 items-center gap-1.5 rounded-full bg-beige px-3 text-sm font-semibold text-ink sm:flex">
              <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
              Coro
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-10 pt-5 sm:px-6">
        {children}
      </main>

      <footer className="border-t border-white/10 bg-ink px-4 pb-[calc(env(safe-area-inset-bottom)+6rem)] pt-8 text-white sm:px-6 md:pb-10">
        <div className="mx-auto grid w-full max-w-6xl gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" aria-label="comidasTop, ir al inicio" className="flex items-center gap-2">
              <Image
                src="/logoreal.jpeg"
                alt=""
                width={40}
                height={40}
                className="h-11 w-11 rounded-full object-contain"
              />
              <span className="font-display text-[22px] leading-none tracking-[-0.05em]">
                <span className="text-white">comidas</span>
                <span className="text-accent">Top</span>
              </span>
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-white/70">
              Descubre dónde comer en Coro, compara platos y encuentra tu
              próximo antojo.
            </p>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-white/60">
              <MapPin className="h-3.5 w-3.5 text-mustard" aria-hidden="true" />
              Coro, Falcón · Venezuela
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
              Explorar
            </p>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm">
              <Link href="/" className="text-white/80 transition hover:text-white">Inicio</Link>
              <Link href="/buscar" className="text-white/80 transition hover:text-white">Buscar</Link>
              <Link href="/favoritos" className="text-white/80 transition hover:text-white">Favoritos</Link>
              <Link href="/cupones" className="text-white/80 transition hover:text-white">Cupones</Link>
              <Link href="/recompensas" className="text-white/80 transition hover:text-white">Recompensas</Link>
              <Link href="/perfil" className="text-white/80 transition hover:text-white">Perfil</Link>
            </div>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/45">
              ComidasTop
            </p>
            <div className="mt-3 flex flex-col items-start gap-2 text-sm">
              <Link href="/solicitud-negocio" className="font-semibold text-mustard transition hover:text-white">
                Registra tu negocio
              </Link>
              <Link href="/terminos" className="text-white/80 transition hover:text-white">Términos y Condiciones</Link>
              <Link href="/privacidad" className="text-white/80 transition hover:text-white">Política de Privacidad</Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 flex w-full max-w-6xl flex-col gap-1 border-t border-white/15 pt-5 text-[11px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 comidasTop. Todos los derechos reservados.</p>
          <p>Hecho para comer bien en Coro.</p>
        </div>
      </footer>

      <PendingVoteButton />

      <nav
        aria-label="Navegación inferior"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 md:hidden"
      >
        <div className="relative mx-auto flex max-w-lg items-stretch gap-1">
          {mobileNavigation.slice(0, 2).map(renderTab)}

          <div className="w-[70px] shrink-0" aria-hidden="true" />

          {mobileNavigation.slice(2).map(renderTab)}

          <Link
            href="/escanear"
            aria-label="Escanear código QR del local"
            className={`absolute left-1/2 top-0 z-10 flex h-[62px] w-[62px] -translate-x-1/2 -translate-y-[42%] items-center justify-center rounded-full border-[5px] border-white bg-accent text-white shadow-[0_8px_22px_rgba(35,28,24,0.32)] transition hover:scale-105 active:scale-95 ${
              scanActive ? "ring-4 ring-accent-tint" : ""
            }`}
          >
            <ScanLine className="h-7 w-7" aria-hidden="true" />
          </Link>

          <span className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-[10px] font-semibold leading-3 text-accent">
            Escanear
          </span>
        </div>
      </nav>
    </div>
  );
}
