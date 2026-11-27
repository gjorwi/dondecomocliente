import { Suspense } from "react";
import { CategoryDetailSkeleton } from "@/components/detail-skeletons";
import CategoryClient from "./category-client";

async function CategoryContent({ params }) {
  const { id } = await params;
  return <CategoryClient categoryId={id} />;
}

export default function CategoryPage({ params }) {
  return (
    <Suspense fallback={<CategoryDetailSkeleton />}>
      <CategoryContent params={params} />
    </Suspense>
  );
}
