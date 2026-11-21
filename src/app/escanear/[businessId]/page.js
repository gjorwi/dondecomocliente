import { Suspense } from "react";
import { businesses } from "@/lib/mock-data";
import ScanRatingClient from "./scan-rating-client";

export const metadata = {
  title: "Puntuar · comidasTop",
  description:
    "Puntúa los platos del local que acabas de escanear, de 1 a 5 estrellas.",
};

export function generateStaticParams() {
  return businesses.map((business) => ({ businessId: business.id }));
}

async function RatingContent({ params }) {
  const { businessId } = await params;
  return <ScanRatingClient businessId={businessId} />;
}

export default function ScanRatingPage({ params }) {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-lg rounded-[24px] bg-soft p-8 text-center text-sm text-muted">
          Cargando menú del local…
        </div>
      }
    >
      <RatingContent params={params} />
    </Suspense>
  );
}
