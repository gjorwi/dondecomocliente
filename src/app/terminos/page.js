import { CONTACT_EMAIL, LegalPage } from "@/components/legal-page";

export const metadata = {
  title: "Términos y Condiciones · comidasTop",
  description: "Términos y condiciones de uso de comidasTop para usuarios y negocios.",
};

const sections = [
  {
    title: "1. Aceptación de los términos",
    paragraphs: [
      "Al acceder y utilizar comidasTop o registrar un negocio en la plataforma, usted acepta quedar vinculado por estos Términos y Condiciones y por nuestra Política de Privacidad. Si no está de acuerdo con alguna parte, le pedimos que no utilice la plataforma.",
    ],
  },
  {
    title: "2. Naturaleza de la plataforma",
    paragraphs: [
      "comidasTop es un directorio informativo de restaurantes, areperas, pizzerías, cafeterías, heladerías y demás negocios de comida en Coro y su área. La plataforma facilita el descubrimiento de negocios y de sus platos, pero no actúa como intermediaria en ningún pedido, pago, domicilio ni acuerdo entre el usuario y el establecimiento.",
      "La información publicada (horarios, precios, disponibilidad, menús, costos de domicilio y ubicación) es proporcionada por cada establecimiento y puede cambiar sin previo aviso. comidasTop no garantiza su exactitud ni su actualización permanente.",
    ],
  },
  {
    title: "3. Registro de negocios",
    paragraphs: [
      "Cualquier negocio de comida puede solicitar su registro desde la plataforma. La solicitud se revisa antes de publicar la ficha: solo aparece en el directorio cuando el administrador la aprueba, y en ese momento se crea su cuenta para administrar el menú.",
      "Quien registra un negocio declara y se compromete a que: es el propietario del negocio o está autorizado para representarlo; la información que entrega (nombre, dirección, municipio, parroquia, sector, ubicación, horarios, precios, domicilio y descripción) es verdadera y la mantendrá actualizada; tiene los derechos sobre las fotografías y textos que sube, o la autorización para usarlos; es responsable de la confidencialidad de su correo y contraseña; y cumple las normas sanitarias, tributarias, municipales y comerciales vigentes en la República Bolivariana de Venezuela.",
      "Para publicar la ficha, comidasTop puede revisar, ajustar o recortar la información y las fotografías entregadas (por ejemplo, corregir el formato de un horario o el encuadre de una foto), sin cambiar su sentido.",
    ],
  },
  {
    title: "4. Costos",
    paragraphs: [
      "Por ahora, el uso de comidasTop es gratuito, tanto para quienes buscan dónde comer como para los negocios que se registran.",
      "Si en el futuro se ofrecen servicios con costo, se informará con anticipación a los negocios registrados, quienes podrán decidir si los contratan. Ningún cobro se aplicará sin su aceptación previa.",
    ],
  },
  {
    title: "5. Aprobación, suspensión y retiro de negocios",
    paragraphs: [
      "comidasTop se reserva el derecho de aprobar, rechazar, pausar o retirar cualquier establecimiento del directorio, en cualquier momento y a criterio del administrador de la plataforma.",
      "Entre las causales se encuentran, sin limitarse a ellas: información falsa o desactualizada, fotografías que no correspondan al negocio o sin derechos de uso, quejas reiteradas de usuarios, incumplimiento de normas sanitarias o legales, o cualquier conducta que afecte la reputación de la plataforma y de sus usuarios.",
      "El negocio puede solicitar en cualquier momento el retiro de su ficha y la eliminación de su cuenta escribiendo al correo de contacto.",
    ],
  },
  {
    title: "6. Pedidos, pagos y domicilios",
    paragraphs: [
      "comidasTop no procesa, gestiona ni es responsable de ningún pedido, pago, domicilio o transacción realizada entre un usuario y un establecimiento. Cualquier acuerdo, pago o solicitud de servicio se realiza directamente entre el cliente y el negocio.",
      "En caso de que un pedido no llegue, llegue incompleto, equivocado o en mal estado, la responsabilidad recae exclusivamente sobre el establecimiento. Le recomendamos confirmar directamente con el negocio la disponibilidad, los tiempos de entrega y las condiciones antes de hacer cualquier pedido.",
    ],
  },
  {
    title: "7. Ubicación y mapas",
    paragraphs: [
      "Para mostrar la ubicación de un negocio y la opción “Cómo llegar”, comidasTop utiliza coordenadas geográficas. Quien registra un negocio autoriza el uso de la ubicación marcada en el mapa o de su ubicación actual para publicar el punto del establecimiento.",
      "Los mapas y la búsqueda de direcciones utilizan servicios de OpenStreetMap. La ubicación del dispositivo solo se usa cuando usted lo autoriza en su navegador.",
    ],
  },
  {
    title: "8. Propiedad intelectual",
    paragraphs: [
      "El diseño, código, marca, logotipo y contenidos propios de comidasTop son propiedad exclusiva de sus administradores.",
      "Las fotografías, textos e información de cada establecimiento siguen siendo de su propiedad y son su responsabilidad. Al subirlos, el negocio autoriza a comidasTop, de forma gratuita y mientras su ficha esté publicada, a mostrarlos en la plataforma, en su panel de negocios y en los enlaces compartidos, para promocionar el negocio dentro del directorio.",
    ],
  },
  {
    title: "9. Modificaciones",
    paragraphs: [
      "comidasTop puede modificar estos Términos y Condiciones en cualquier momento. Los cambios entran en vigor desde su publicación en esta página, y la fecha de última actualización indica la versión vigente. El uso continuado de la plataforma tras los cambios constituye aceptación de los nuevos términos.",
    ],
  },
  {
    title: "10. Ley aplicable",
    paragraphs: [
      "Estos términos se rigen por las leyes de la República Bolivariana de Venezuela. Cualquier controversia se someterá a los tribunales competentes de la República.",
    ],
  },
  {
    title: "11. Contacto",
    paragraphs: [`Para consultas sobre estos términos puede escribirnos a ${CONTACT_EMAIL}.`],
  },
];

export default function TermsPage() {
  return <LegalPage title="Términos y Condiciones" sections={sections} />;
}
