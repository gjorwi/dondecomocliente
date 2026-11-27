import { Suspense } from "react";
import { DishDetailSkeleton } from "@/components/detail-skeletons";
import DishClient from "./dish-client";

async function DishContent({ params }) {
  const { id } = await params;
  return <DishClient productId={id} />;
}

export default function DishPage({ params }) {
  return (
    <Suspense fallback={<DishDetailSkeleton />}>
      <DishContent params={params} />
    </Suspense>
  );
}
