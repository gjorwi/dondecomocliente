import { Suspense } from "react";
import ScanClient from "./scan-client";

export const metadata = {
  title: "Escanear · comidasTop",
  description:
    "Escanea el código QR del local para puntuar sus platos y ver su menú.",
};

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
          Cargando escáner…
        </div>
      }
    >
      <ScanClient />
    </Suspense>
  );
}
