import { BackLink } from "@/components/ui";

export const CONTACT_EMAIL = "contacto@comidastop.app";
export const LEGAL_UPDATED = "noviembre de 2026";

export function LegalPage({ title, sections }) {
  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/" label="Volver al inicio" />

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Legal
      </p>
      <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
        {title}
      </h1>
      <p className="mt-2 text-xs text-muted">Última actualización: {LEGAL_UPDATED}</p>

      <div className="mt-6 space-y-4">
        {sections.map((section) => (
          <section key={section.title} className="rounded-[24px] bg-white p-5 shadow-sm">
            <h2 className="font-display text-xl tracking-[-0.03em] text-ink">
              {section.title}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-6 text-muted">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
