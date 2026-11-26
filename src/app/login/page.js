import { Suspense } from "react";
import LoginClient from "./login-client";

export const metadata = {
  title: "Iniciar sesión · comidasTop",
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
          Preparando el acceso…
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
