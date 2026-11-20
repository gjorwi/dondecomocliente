import { Suspense } from "react";
import { categories } from "@/lib/mock-data";
import CategoryClient from "./category-client";

export function generateStaticParams() {
  return categories.map((category) => ({ id: category.id }));
}

async function CategoryContent({ params }) {
  const { id } = await params;
  return <CategoryClient categoryId={id} />;
}

export default function CategoryPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
          Cargando categoría…
        </div>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  );
}
