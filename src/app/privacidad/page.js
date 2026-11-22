import { CONTACT_EMAIL, LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Política de Privacidad · comidasTop",
  description: "Cómo comidasTop trata los datos personales, la ubicación y las fotografías.",
};

const sections = [
  {
    title: "1. Responsable del tratamiento",
    paragraphs: [
      `El responsable del tratamiento de los datos personales es comidasTop, plataforma de directorio de comida en Coro, Estado Falcón, Venezuela. Puede contactarnos en ${CONTACT_EMAIL}.`,
    ],
  },
  {
    title: "2. Marco legal",
    paragraphs: [
      "Esta política se rige por los derechos a la privacidad, al honor y a la protección de datos previstos en la Constitución de la República Bolivariana de Venezuela (artículos 28 y 60), y por las normas aplicables en materia de mensajes de datos, firmas electrónicas y delitos informáticos. Tratamos sus datos con base en su consentimiento informado al enviar formularios o al aceptar esta política.",
    ],
  },
  {
    title: "3. Si solo navegas el directorio",
    paragraphs: [
      "Para buscar negocios y ver sus menús no necesitas crear una cuenta ni entregar datos personales. En ese caso podemos tratar:",
      "Favoritos y preferencias de búsqueda, guardados solo en tu navegador (localStorage). No salen de tu dispositivo y puedes borrarlos desde la configuración del navegador.",
      "Tu dirección IP, usada de forma temporal para proteger el sitio contra abusos. No la asociamos a tu identidad.",
      "Tu ubicación, únicamente si la autorizas en el navegador para centrar el mapa o completar la ubicación de un negocio. No la almacenamos vinculada a tu identidad.",
    ],
  },
  {
    title: "4. Si registras un negocio",
    paragraphs: [
      "Al enviar la solicitud de registro recopilamos:",
      "Datos del responsable: nombre, correo electrónico y teléfono / WhatsApp. Estos datos no se publican en el directorio.",
      "Datos del negocio: nombre, categoría o tipo de negocio, si hace domicilio, municipio, parroquia, sector, dirección, ubicación marcada en el mapa, horario, descripción y fotografía de portada.",
      "Registro de tu aceptación: fecha y versión de los Términos y Condiciones y de esta política que aceptaste.",
      "Los datos del negocio se publican en el directorio una vez aprobada la ficha, porque ese es el propósito del registro.",
    ],
  },
  {
    title: "5. Para qué usamos los datos",
    paragraphs: [
      "Revisar y aprobar la solicitud, crear y administrar la cuenta del negocio y su menú.",
      "Publicar la ficha del negocio en el directorio, con su ubicación y la opción “Cómo llegar”.",
      "Contactarte sobre tu solicitud, tu cuenta o cambios en la plataforma.",
      "Generar estadísticas anónimas de uso y mejorar la plataforma.",
    ],
  },
  {
    title: "6. Con quién compartimos los datos",
    paragraphs: [
      "comidasTop no vende ni alquila datos personales. Solo los compartimos con proveedores que los procesan por nuestra cuenta: MongoDB Atlas (base de datos), el proveedor de alojamiento del sitio y OpenStreetMap (mapas y búsqueda de direcciones). Al marcar un punto en el mapa, sus coordenadas se envían a OpenStreetMap para obtener la dirección. Estos proveedores pueden estar fuera de Venezuela y aplican sus propias medidas de seguridad.",
      "Podremos entregar información cuando una autoridad competente lo exija conforme a la ley.",
    ],
  },
  {
    title: "7. Tus derechos",
    paragraphs: [
      "Como titular de tus datos puedes: conocer, actualizar y rectificar tus datos; pedir prueba de la autorización que nos diste; ser informado del uso que damos a tus datos; oponerte al tratamiento o revocar tu autorización; y solicitar la eliminación de tus datos y de tu cuenta, salvo que exista un deber legal o contractual de conservarlos.",
      `Para ejercerlos, escríbenos a ${CONTACT_EMAIL} indicando tu nombre, el negocio registrado (si aplica) y tu solicitud. Daremos respuesta en un plazo razonable.`,
    ],
  },
  {
    title: "8. Conservación y seguridad",
    paragraphs: [
      "Conservamos los datos mientras tu cuenta o tu ficha estén activas, o hasta que solicites su eliminación. Usamos conexiones cifradas (HTTPS), contraseñas almacenadas de forma cifrada, acceso restringido al panel de administración y controles que impiden leer los datos privados de los responsables desde el sitio público.",
    ],
  },
  {
    title: "9. Cookies",
    paragraphs: [
      "Solo usamos cookies y almacenamiento técnicos necesarios para el funcionamiento del sitio, como la sesión del panel de negocios y administración. No usamos cookies de publicidad ni de rastreo de terceros.",
    ],
  },
  {
    title: "10. Cambios a esta política",
    paragraphs: [
      "Esta política puede actualizarse. Si el cambio es importante, por ejemplo nuevas finalidades o nuevos servicios, lo informaremos a los negocios registrados. La fecha de última actualización indica la versión vigente.",
      "Consulta también nuestros Términos y Condiciones.",
    ],
  },
];

export default function PrivacyPage() {
  return <LegalPage title="Política de Privacidad" sections={sections} />;
}
