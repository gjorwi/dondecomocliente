import { CardGrid, CardSkeleton } from "@/components/ui";
import {
  CategoryChipsSkeleton,
  TopThreePodium,
} from "@/components/podium";

function BackSkeleton() {
  return <div className="mb-4 h-5 w-24 rounded-full bg-beige/80" />;
}

export function DishDetailSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="min-h-[65vh] animate-pulse"
    >
      <span className="sr-only">Cargando plato…</span>
      <BackSkeleton />
      <div className="h-52 rounded-[30px] bg-beige/70 sm:h-64" />
      <div className="mt-5 max-w-3xl">
        <div className="h-9 w-2/3 rounded-full bg-beige/80" />
        <div className="mt-2 h-4 w-1/2 rounded-full bg-beige/60" />
        <div className="mt-4 h-24 rounded-[24px] bg-soft" />
        <div className="mt-5 space-y-2">
          <div className="h-3 w-full rounded-full bg-beige/60" />
          <div className="h-3 w-4/5 rounded-full bg-beige/60" />
        </div>
        <div className="mt-3 h-16 rounded-[24px] bg-soft" />
        <div className="mt-5 flex flex-wrap gap-2">
          <div className="h-11 w-40 rounded-full bg-beige/80" />
          <div className="h-11 w-36 rounded-full bg-beige/60" />
          <div className="h-11 w-28 rounded-full bg-beige/60" />
        </div>
      </div>
    </div>
  );
}

export function BusinessDetailSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="min-h-[75vh] animate-pulse"
    >
      <span className="sr-only">Cargando establecimiento…</span>
      <BackSkeleton />
      <div className="h-48 rounded-[30px] bg-beige/70 sm:h-56" />
      <div className="mt-5">
        <div className="h-9 w-2/3 rounded-full bg-beige/80" />
        <div className="mt-2 h-4 w-1/2 rounded-full bg-beige/60" />
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-[1.15fr_0.85fr]">
        <div className="h-40 rounded-[24px] bg-soft" />
        <div className="h-40 rounded-[24px] bg-white" />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <div className="h-11 w-44 rounded-full bg-beige/80" />
        <div className="h-11 w-28 rounded-full bg-beige/60" />
        <div className="h-11 w-32 rounded-full bg-beige/60" />
        <div className="h-11 w-28 rounded-full bg-white" />
      </div>
      <div className="mt-8">
        <div className="h-7 w-40 rounded-full bg-beige/80" />
        <div className="mt-2 h-4 w-2/3 rounded-full bg-beige/60" />
        <div className="mt-4">
          <CardGrid>
            {Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </CardGrid>
        </div>
      </div>
      <div className="mt-6 h-32 rounded-[24px] bg-white" />
    </div>
  );
}

export function CategoryDetailSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      className="min-h-[70vh] animate-pulse"
    >
      <span className="sr-only">Cargando categoría…</span>
      <BackSkeleton />
      <div className="h-32 rounded-[30px] bg-accent-tint" />
      <div className="mt-5">
        <CategoryChipsSkeleton light />
      </div>
      <div className="mt-4">
        <TopThreePodium loading />
      </div>
      <div className="mt-5 h-24 rounded-[24px] bg-white" />
    </div>
  );
}
