"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useClientAuth } from "@/components/auth-provider";

let googleScriptPromise = null;

function loadGoogleScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Google no está disponible en el servidor."));
  }
  if (window.google?.accounts?.id) return Promise.resolve();
  if (googleScriptPromise) return googleScriptPromise;

  googleScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error("No se pudo cargar la librería de Google."));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export function GoogleLoginButton({ next = "/perfil", className = "" }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const { loginWithGoogle } = useClientAuth();
  const router = useRouter();
  const buttonRef = useRef(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!clientId || !buttonRef.current) return undefined;

    let cancelled = false;
    loadGoogleScript()
      .then(() => {
        if (cancelled || !buttonRef.current || !window.google?.accounts?.id) {
          return;
        }

        window.google.accounts.id.initialize({
          client_id: clientId,
          auto_select: false,
          cancel_on_tap_outside: true,
          callback: async (response) => {
            if (!response?.credential) {
              setError("Google no devolvió una credencial válida.");
              return;
            }

            setLoading(true);
            setError("");
            try {
              await loginWithGoogle(response.credential);
              router.replace(next || "/perfil");
            } catch (loginError) {
              setError(
                loginError.message || "No se pudo iniciar sesión con Google.",
              );
            } finally {
              setLoading(false);
            }
          },
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          shape: "pill",
          text: "continue_with",
          logo_alignment: "left",
          width: 280,
        });
      })
      .catch(() => {
        setError("No se pudo cargar el botón de Google.");
      });

    return () => {
      cancelled = true;
    };
  }, [clientId, loginWithGoogle, next, router]);

  if (!clientId) {
    return (
      <div className={className}>
        <div className="rounded-2xl border border-dashed border-line bg-soft p-4 text-center text-xs leading-5 text-muted">
          El acceso con Google aún no está configurado. Agrega
          <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-[11px] text-ink">
            NEXT_PUBLIC_GOOGLE_CLIENT_ID
          </code>
          en el entorno del cliente web.
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div
        ref={buttonRef}
        className={`flex min-h-11 justify-center transition ${
          loading ? "pointer-events-none opacity-60" : ""
        }`}
      />
      {error ? (
        <p className="mt-2 text-center text-xs font-semibold text-accent">
          {error}
        </p>
      ) : null}
    </div>
  );
}
