import { Suspense } from "react";
import { products } from "@/lib/mock-data";
import DishClient from "./dish-client";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

async function DishContent({ params }) {
  const { id } = await params;
  return <DishClient productId={id} />;
}

export default function DishPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
          Cargando plato…
        </div>
      }
    >
      <DishContent params={params} />
    </Suspense>
  );
}
