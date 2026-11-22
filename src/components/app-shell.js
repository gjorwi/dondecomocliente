"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  MapPin,
  ScanLine,
  Search,
  UserRound,
} from "lucide-react";

const navigation = [
  { href: "/", label: "Explorar", icon: Home },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function AppShell({ children }) {
  const pathname = usePathname();
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
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <Link
            href="/"
            aria-label="comidasTop, ir al inicio"
            className="flex shrink-0 items-center gap-2 font-display text-[24px] leading-none tracking-[-0.055em] sm:gap-2.5 sm:text-[26px]"
          >
            <Image
              src="/logo.jpg"
              alt=""
              width={40}
              height={40}
              priority
              className="h-8 w-8 shrink-0 rounded-full object-contain sm:h-10 sm:w-10"
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

          <div className="flex min-h-10 items-center gap-1.5 rounded-full bg-beige px-3 text-sm font-semibold text-ink md:hidden lg:flex">
            <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
            Coro
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 md:pb-14">
        {children}
      </main>

      <nav
        aria-label="Navegación inferior"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 md:hidden"
      >
        <div className="relative mx-auto flex max-w-lg items-stretch gap-1">
          {navigation.slice(0, 2).map(renderTab)}

          <div className="w-[70px] shrink-0" aria-hidden="true" />

          {navigation.slice(2).map(renderTab)}

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
