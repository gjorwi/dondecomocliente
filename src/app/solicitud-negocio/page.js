import BusinessRequestClient from "./solicitud-client";

export const metadata = {
  title: "Registra tu negocio · comidasTop",
  description:
    "Envía la solicitud para que tu establecimiento aparezca en comidasTop.",
};

export const instant = false;

export default function BusinessRequestPage() {
  return <BusinessRequestClient />;
}
