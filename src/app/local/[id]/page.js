import { Suspense } from "react";
import { BusinessDetailSkeleton } from "@/components/detail-skeletons";
import BusinessClient from "./business-client";

async function BusinessContent({ params }) {
  const { id } = await params;
  return <BusinessClient businessId={id} />;
}

export default function BusinessPage({ params }) {
  return (
    <Suspense fallback={<BusinessDetailSkeleton />}>
      <BusinessContent params={params} />
    </Suspense>
  );
}
