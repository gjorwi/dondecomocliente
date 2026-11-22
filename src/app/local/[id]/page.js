import { Suspense } from "react";
import BusinessClient from "./business-client";

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
