"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export function ShareButton({
  path,
  title,
  text,
  label = "Compartir",
  iconOnly = false,
  onShared,
  className = "",
}) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    if (!path || typeof window === "undefined") return;

    const url = new URL(path, window.location.origin).toString();
    const shareData = {
      title,
      text: text || title,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        onShared?.("native");
        return;
      }
    } catch (error) {
      if (error?.name === "AbortError") return;
    }

    try {
      await copyText(url);
      setCopied(true);
      onShared?.("copy");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permisos de portapapeles.
    }
  };

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={share}
        aria-label={`Compartir ${title}`}
        title={`Compartir ${title}`}
        className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-ink shadow-sm ring-1 ring-line/60 transition hover:bg-white hover:text-accent ${className}`}
      >
        {copied ? (
          <Check className="h-4 w-4 text-open" aria-hidden="true" />
        ) : (
          <Share2 className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={share}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full bg-beige px-5 text-sm font-semibold text-ink transition hover:bg-[#ebe0d4] ${className}`}
    >
      {copied ? (
        <Check className="h-4 w-4 text-open" aria-hidden="true" />
      ) : (
        <Share2 className="h-4 w-4" aria-hidden="true" />
      )}
      {copied ? "Enlace copiado" : label}
    </button>
  );
}
