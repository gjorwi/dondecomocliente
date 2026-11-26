import localFont from "next/font/local";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { ClientAuthProvider } from "@/components/auth-provider";
import { SavedProvider } from "@/components/saved-provider";

const figtree = localFont({
  src: [
    { path: "./fonts/Figtree_400Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Figtree_600SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Figtree_700Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-figtree",
  display: "swap",
});

const bricolage = localFont({
  src: [
    {
      path: "./fonts/BricolageGrotesque_800ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata = {
  title: "comidasTop · Clientes",
  description:
    "Encuentra platos y establecimientos de comida en Coro según su reputación.",
};

export const viewport = {
  themeColor: "#c9410f",
};

export const instant = false;

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${figtree.variable} ${bricolage.variable}`}>
      <body>
        <ClientAuthProvider>
          <SavedProvider>
            <AppShell>{children}</AppShell>
          </SavedProvider>
        </ClientAuthProvider>
      </body>
    </html>
  );
}
