"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, MapPin, Search, UserRound } from "lucide-react";

const navigation = [
  { href: "/", label: "Explorar", icon: Home },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/guardados", label: "Guardados", icon: Heart },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function AppShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          <Link
            href="/"
            aria-label="dóndecomo, ir al inicio"
            className="font-display text-[26px] leading-none tracking-[-0.055em]"
          >
            <span className="text-ink">dónde</span>
            <span className="text-accent">como</span>
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
                  className={`flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition ${
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
          </nav>

          <div className="flex min-h-10 items-center gap-1.5 rounded-full bg-beige px-3 text-sm font-semibold text-ink">
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
        className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white px-2 pb-[env(safe-area-inset-bottom)] pt-2 md:hidden"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-between gap-1">
          {navigation.map(({ href, label, icon: Icon }) => {
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
          })}
        </div>
      </nav>
    </div>
  );
}
