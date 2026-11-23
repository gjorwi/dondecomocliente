"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

export function QrScanner({ onResult }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const resultRef = useRef(onResult);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    resultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Tu navegador no permite abrir la cámara. Prueba desde un navegador actualizado.");
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        video.srcObject = stream;
        await video.play();
        setReady(true);

        const { default: jsQR } = await import("jsqr");
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d", { willReadFrequently: true });

        const scan = () => {
          if (cancelled) return;

          if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const image = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(image.data, canvas.width, canvas.height, {
              inversionAttempts: "dontInvert",
            });

            if (code?.data) {
              resultRef.current?.(code.data);
              return;
            }
          }

          frameRef.current = requestAnimationFrame(scan);
        };

        scan();
      } catch {
        if (!cancelled) {
          setError(
            "No pudimos acceder a la cámara. Permite el acceso o revisa que la cámara esté disponible.",
          );
        }
      }
    };

    start();

    return () => {
      cancelled = true;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  return (
    <div>
      <div className="relative mx-auto flex aspect-square w-full max-w-[340px] items-center justify-center overflow-hidden rounded-[28px] bg-ink">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          aria-label="Vista de la cámara para escanear el QR"
          className="h-full w-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        <span className="pointer-events-none absolute left-5 top-5 h-9 w-9 rounded-tl-xl border-l-[3px] border-t-[3px] border-mustard" />
        <span className="pointer-events-none absolute right-5 top-5 h-9 w-9 rounded-tr-xl border-r-[3px] border-t-[3px] border-mustard" />
        <span className="pointer-events-none absolute bottom-5 left-5 h-9 w-9 rounded-bl-xl border-b-[3px] border-l-[3px] border-mustard" />
        <span className="pointer-events-none absolute bottom-5 right-5 h-9 w-9 rounded-br-xl border-b-[3px] border-r-[3px] border-mustard" />

        {!ready ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/80 px-6 text-center text-sm text-white/75">
            <Camera className="h-7 w-7 text-mustard" aria-hidden="true" />
            {error || "Pidiendo acceso a la cámara…"}
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-muted">
        <span className="h-2 w-2 rounded-full bg-open" />
        Apunta la cámara al QR de la mesa
      </div>
    </div>
  );
}
