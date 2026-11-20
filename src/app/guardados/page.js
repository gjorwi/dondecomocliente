"use client";

import {
  BusinessCard,
  CardGrid,
  DishCard,
  EmptyState,
  SectionTitle,
} from "@/components/ui";
import { useBusinesses, useProducts } from "@/lib/hooks";
import { useSaved } from "@/components/saved-provider";

export default function SavedPage() {
  const { savedIds, ready } = useSaved();
  const { products } = useProducts();
  const { businesses } = useBusinesses();

  const savedProducts = products.filter((product) =>
    savedIds.includes(`dish:${product.id}`),
  );
  const savedBusinesses = businesses.filter((business) =>
    savedIds.includes(`local:${business.id}`),
  );

  if (!ready) {
    return (
      <div className="rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
        Cargando guardados…
      </div>
    );
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Tu selección
      </p>
      <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
        Tus guardados
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Lugares y platos que quieres tener a mano.
      </p>

      {savedProducts.length === 0 && savedBusinesses.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Todavía no guardas nada"
            description="Guarda un plato o establecimiento para encontrarlo aquí."
            action="Explorar Coro"
            href="/"
          />
        </div>
      ) : null}

      {savedProducts.length > 0 ? (
        <>
          <SectionTitle title="Platos" description={`${savedProducts.length} guardados`} />
          <CardGrid>
            {savedProducts.map((product) => (
              <DishCard key={product.id} product={product} />
            ))}
          </CardGrid>
        </>
      ) : null}

      {savedBusinesses.length > 0 ? (
        <>
          <SectionTitle
            title="Establecimientos"
            description={`${savedBusinesses.length} guardados`}
          />
          <CardGrid>
            {savedBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </CardGrid>
        </>
      ) : null}

      <p className="mt-8 text-center text-xs text-muted">
        Los guardados se conservan en este navegador.
      </p>
    </div>
  );
}
