import { Suspense } from "react";
import { businesses } from "@/lib/mock-data";
import BusinessClient from "./business-client";

export function generateStaticParams() {
  return businesses.map((business) => ({ id: business.id }));
}

async function BusinessContent({ params }) {
  const { id } = await params;
  return <BusinessClient businessId={id} />;
}

export default function BusinessPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
          Cargando establecimiento…
        </div>
      }
    >
      <BusinessContent params={params} />
    </Suspense>
  );
}
