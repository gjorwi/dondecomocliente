"use client";

import {
  BusinessCard,
  CardGrid,
  CardSkeleton,
  DishCard,
  EmptyState,
  Pill,
  SectionTitle,
} from "@/components/ui";
import { GoogleLoginButton } from "@/components/google-login-button";
import { useClientAuth } from "@/components/auth-provider";
import { useBusinesses, useProducts } from "@/lib/hooks";
import { useSaved } from "@/components/saved-provider";

function FavoritesSkeleton() {
  return (
    <div aria-busy="true" aria-label="Cargando favoritos">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Tu selección
      </p>
      <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
        Tus favoritos
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Lugares y platos que quieres tener a mano.
      </p>

      <div className="mb-3 mt-8 h-7 w-28 animate-pulse rounded-xl bg-line/60" />
      <CardGrid>
        {Array.from({ length: 4 }).map((_, index) => (
          <CardSkeleton key={index} />
        ))}
      </CardGrid>
    </div>
  );
}

export default function FavoritesClient() {
  const { savedIds, ready } = useSaved();
  const { user, ready: authReady } = useClientAuth();
  const { products, isLoading: productsLoading } = useProducts();
  const { businesses, isLoading: businessesLoading } = useBusinesses();

  const loading =
    !authReady ||
    !ready ||
    Boolean(user && (productsLoading || businessesLoading));

  const favoriteProducts = products.filter((product) =>
    savedIds.includes(`dish:${product.id}`),
  );
  const favoriteBusinesses = businesses.filter((business) =>
    savedIds.includes(`local:${business.id}`),
  );

  if (loading) {
    return <FavoritesSkeleton />;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
          Tu selección
        </p>
        <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
          Tus favoritos
        </h1>
        <div className="mt-5 rounded-[28px] bg-white p-5 shadow-sm sm:p-6">
          <Pill tone="amber">Acceso requerido</Pill>
          <p className="mt-3 text-sm leading-6 text-muted">
            Inicia sesión para guardar locales y platos en tu cuenta y
            encontrarlos en cualquier dispositivo.
          </p>
          <div className="mt-5">
            <GoogleLoginButton next="/favoritos" />
          </div>
        </div>
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
        Tus favoritos se guardan en tu cuenta.
      </p>
    </div>
  );
}
