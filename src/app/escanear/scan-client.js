"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, MapPin } from "lucide-react";
import { BackLink, Pill } from "@/components/ui";
import { QrScanner } from "@/components/qr-scanner";
import { registerScan } from "@/lib/api";
import { getCurrentLocation } from "@/lib/geolocation";
import { saveScanSession } from "@/lib/scan-session";

function extractBusinessId(value) {
  const text = String(value || "").trim();
  if (!text) return "";

  try {
    const url = new URL(text, window.location.origin);
    const match = url.pathname.match(/\/escanear\/([^/?#]+)/);
    if (match) return decodeURIComponent(match[1]);
  } catch {
    // También aceptamos QRs que contengan solo el identificador del negocio.
  }

  return /^[a-z0-9][a-z0-9-]*$/i.test(text) ? text : "";
}

export default function ScanClient() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [scannerKey, setScannerKey] = useState(0);
  const [verifying, setVerifying] = useState(false);

  const handleResult = useCallback(
    async (data) => {
      if (verifying) return;

      const businessId = extractBusinessId(data);
      if (!businessId) {
        setError("El QR no corresponde a un local de comidasTop. Intenta de nuevo.");
        setScannerKey((current) => current + 1);
        return;
      }

      setVerifying(true);
      setError("");

      try {
        const location = await getCurrentLocation();
        const payload = await registerScan(businessId, location);
        saveScanSession(businessId, payload.visit);
        router.push(`/escanear/${businessId}`);
      } catch (scanError) {
        setError(
          scanError instanceof TypeError
            ? "No pudimos conectar con la API. Verifica que esté activa e intenta de nuevo."
            : scanError.message ||
                "No pudimos validar tu ubicación. Intenta escanear de nuevo.",
        );
        setScannerKey((current) => current + 1);
      } finally {
        setVerifying(false);
      }
    },
    [router, verifying],
  );

  return (
    <div className="mx-auto max-w-lg">
      <BackLink href="/" />

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Escáner
      </p>
      <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
        Escanea el QR del local
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        El escaneo es la única forma de puntuar los platos del establecimiento.
        Validaremos que estés en el local antes de habilitar tus votos.
      </p>

      <section className="relative mt-6 rounded-[32px] bg-ink p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Pill tone="amber">Cámara en vivo</Pill>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/50">
            Escanea el QR de la mesa
          </span>
        </div>
        <QrScanner key={scannerKey} onResult={handleResult} />

        {verifying ? (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[32px] bg-ink/85 px-6 text-center text-sm font-semibold text-white">
            <Loader2 className="h-7 w-7 animate-spin text-mustard" aria-hidden="true" />
            Validando que estés en el local…
          </div>
        ) : null}
      </section>

      {error ? (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-[20px] bg-accent-tint p-4 text-sm font-semibold leading-5 text-accent"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </div>
      ) : null}

      <div className="mt-4 flex items-start gap-2 rounded-[24px] bg-green-tint p-4 text-xs leading-5 text-open">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <p>
          Al escanear permitimos <strong>2 votos</strong> durante las próximas{" "}
          <strong>24 horas</strong>. La ubicación se usa solo para confirmar que
          estás cerca del local.
        </p>
      </div>

      <div className="mt-3 rounded-[24px] bg-amber-tint p-4 text-xs leading-5 text-[#6a4700]">
        <p className="font-semibold">¿Dónde está el QR?</p>
        <p className="mt-1">
          Pídelo en el local o búscalo en la mesa. Al escanearlo se abrirá el
          menú de ese negocio para que puedas puntuar sus platos.
        </p>
      </div>
    </div>
  );
}
