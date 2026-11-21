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

export default function FavoritesPage() {
  const { savedIds, ready } = useSaved();
  const { products } = useProducts();
  const { businesses } = useBusinesses();

  const favoriteProducts = products.filter((product) =>
    savedIds.includes(`dish:${product.id}`),
  );
  const favoriteBusinesses = businesses.filter((business) =>
    savedIds.includes(`local:${business.id}`),
  );

  if (!ready) {
    return (
      <div className="rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
        Cargando favoritos…
      </div>
    );
  }

  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Tu selección
      </p>
      <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
        Tus favoritos
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Lugares y platos que quieres tener a mano.
      </p>

      {favoriteProducts.length === 0 && favoriteBusinesses.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            title="Todavía no tienes favoritos"
            description="Marca un plato o establecimiento con el corazón para encontrarlo aquí."
            action="Explorar Coro"
            href="/"
          />
        </div>
      ) : null}

      {favoriteProducts.length > 0 ? (
        <>
          <SectionTitle
            title="Platos"
            description={`${favoriteProducts.length} favoritos`}
          />
          <CardGrid>
            {favoriteProducts.map((product) => (
              <DishCard key={product.id} product={product} />
            ))}
          </CardGrid>
        </>
      ) : null}

      {favoriteBusinesses.length > 0 ? (
        <>
          <SectionTitle
            title="Establecimientos"
            description={`${favoriteBusinesses.length} favoritos`}
          />
          <CardGrid>
            {favoriteBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </CardGrid>
        </>
      ) : null}

      <p className="mt-8 text-center text-xs text-muted">
        Los favoritos se conservan en este navegador.
      </p>
    </div>
  );
}
