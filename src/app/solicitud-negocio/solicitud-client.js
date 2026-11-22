"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Camera, Check, LocateFixed, X } from "lucide-react";
import { BackLink, Button } from "@/components/ui";
import { LocationPicker } from "@/components/location-picker";
import { submitBusinessRequest } from "@/lib/api";
import { compressCoverImage } from "@/lib/image";
import { reverseGeocode } from "@/lib/geo";
import { useCategories } from "@/lib/hooks";

const OTHER_CATEGORY = "otro";

const emptyForm = {
  businessName: "",
  categoryKey: "",
  categoryOther: "",
  hasDelivery: null,
  municipality: "",
  parish: "",
  sector: "",
  address: "",
  location: null,
  hours: "",
  description: "",
  ownerName: "",
  email: "",
  phone: "",
  whatsapp: "",
};

const inputClass =
  "mt-1.5 w-full rounded-2xl border border-line bg-soft px-4 py-3 text-sm font-normal text-ink outline-none transition placeholder:text-muted focus:border-accent/60 focus:bg-white";

function Field({ label, helper, required = false, children }) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      {required ? <span className="ml-1 text-accent" aria-hidden="true">*</span> : null}
      {children}
      {helper ? (
        <span className="mt-1 block text-[11px] font-normal leading-4 text-muted">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function ChoiceButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`inline-flex min-h-11 flex-1 items-center justify-center rounded-full border text-sm font-semibold transition ${
        selected
          ? "border-accent bg-accent text-white"
          : "border-line bg-soft text-ink hover:border-accent/40"
      }`}
    >
      {children}
    </button>
  );
}

export default function BusinessRequestClient() {
  const { categories } = useCategories();
  const [form, setForm] = useState(emptyForm);
  const [coverImage, setCoverImage] = useState("");
  const [coverError, setCoverError] = useState("");
  const [locating, setLocating] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(null);

  const set = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const applyLocation = (point) => {
    set("location", point);
    setAddressLoading(true);
    reverseGeocode(point)
      .then((address) => {
        if (address) set("address", address);
      })
      .catch(() => {})
      .finally(() => setAddressLoading(false));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Tu navegador no permite obtener la ubicación. Márcala en el mapa.");
      return;
    }
    setError("");
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        applyLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setLocating(false);
        setError(
          "No pudimos obtener tu ubicación. Revisa los permisos del navegador o márcala en el mapa.",
        );
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const onCoverChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setCoverError("");
    try {
      setCoverImage(await compressCoverImage(file));
    } catch (imageError) {
      setCoverError(imageError.message);
    }
  };

  const validate = () => {
    const email = form.email.trim().toLowerCase();
    const whatsapp = form.whatsapp.replace(/\D/g, "");

    if (form.categoryKey === OTHER_CATEGORY && form.categoryOther.trim().length < 2) {
      return 'Escribe el tipo de negocio en la opción "Otro".';
    }
    if (form.hasDelivery === null) {
      return "Indica si el negocio hace domicilio.";
    }
    if (!coverImage) {
      return "Agrega una foto de portada del negocio.";
    }
    if (!form.location) {
      return "Marca la ubicación en el mapa o usa tu ubicación actual.";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Escribe un correo válido.";
    }
    if (whatsapp.length < 10) {
      return "Escribe el WhatsApp con código de país, solo con números.";
    }
    if (!termsAccepted) {
      return "Debes aceptar los términos y la política de privacidad.";
    }
    return "";
  };

  const submit = async (event) => {
    event.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const payload = await submitBusinessRequest({
        businessName: form.businessName.trim(),
        categoryKey: form.categoryKey,
        categoryOther:
          form.categoryKey === OTHER_CATEGORY ? form.categoryOther.trim() : "",
        hasDelivery: form.hasDelivery,
        municipality: form.municipality.trim(),
        parish: form.parish.trim(),
        sector: form.sector.trim(),
        address: form.address.trim(),
        location: form.location,
        coverImage,
        hours: form.hours.trim(),
        description: form.description.trim(),
        ownerName: form.ownerName.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.replace(/\D/g, ""),
        termsAccepted: true,
      });
      setSent(payload.request);
    } catch (submitError) {
      setError(
        submitError instanceof TypeError
          ? "No pudimos conectar con el servidor. Intenta más tarde."
          : submitError.message || "No se pudo enviar la solicitud.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="mx-auto max-w-lg">
        <BackLink href="/" label="Volver al inicio" />
        <section className="rounded-[28px] bg-green-tint p-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white">
            <Check className="h-7 w-7 text-open" aria-hidden="true" />
          </span>
          <h1 className="mt-4 font-display text-[30px] leading-tight tracking-[-0.04em] text-ink">
            Solicitud enviada
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted">
            Recibimos los datos de {sent.businessName}. El equipo los revisará y
            te entregará tus credenciales para administrar tu establecimiento.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-white transition hover:bg-[#b33a0d]"
          >
            Volver a explorar
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <BackLink href="/" label="Volver al inicio" />

      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
        Para negocios
      </p>
      <h1 className="mt-2 font-display text-[38px] leading-none tracking-[-0.045em] text-ink">
        Registra tu negocio
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted">
        Envía los datos de tu establecimiento. Al aprobarlo, recibirás las
        credenciales para administrar tu menú.
      </p>
      <p className="mt-3 text-xs font-semibold text-accent">
        <span aria-hidden="true">*</span> Campos obligatorios
      </p>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <section className="space-y-4 rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="font-display text-xl tracking-[-0.03em] text-ink">
            Tu establecimiento
          </h2>

          <Field label="Nombre del establecimiento" required>
            <input
              required
              value={form.businessName}
              onChange={(event) => set("businessName", event.target.value)}
              placeholder="Ej. Arepera Doña Luisa"
              className={inputClass}
            />
          </Field>

          <Field label="Categoría principal" required>
            <select
              required
              value={form.categoryKey}
              onChange={(event) => set("categoryKey", event.target.value)}
              className={inputClass}
            >
              <option value="" disabled>
                Selecciona una categoría
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
              <option value={OTHER_CATEGORY}>Otro</option>
            </select>
          </Field>

          {form.categoryKey === OTHER_CATEGORY ? (
            <Field
              label="Tipo de negocio"
              required
              helper="Ej. Panadería, heladería, cafetería, comida china."
            >
              <input
                required
                value={form.categoryOther}
                onChange={(event) => set("categoryOther", event.target.value)}
                className={inputClass}
              />
            </Field>
          ) : null}

          <div>
            <p className="text-sm font-semibold text-ink">
              ¿Hace domicilio?<span className="ml-1 text-accent" aria-hidden="true">*</span>
            </p>
            <div role="radiogroup" aria-label="¿Hace domicilio?" aria-required="true" className="mt-1.5 flex gap-2">
              <ChoiceButton
                selected={form.hasDelivery === true}
                onClick={() => set("hasDelivery", true)}
              >
                Sí, hace domicilio
              </ChoiceButton>
              <ChoiceButton
                selected={form.hasDelivery === false}
                onClick={() => set("hasDelivery", false)}
              >
                No, solo en el local
              </ChoiceButton>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink">
              Foto de portada<span className="ml-1 text-accent" aria-hidden="true">*</span>
            </p>
            <p className="mt-0.5 text-[11px] leading-4 text-muted">
              Se verá en la ficha de tu negocio. Usa una foto horizontal de tu
              local o de tus platos.
            </p>
            {coverImage ? (
              <div className="relative mt-2 h-44 overflow-hidden rounded-[20px] bg-accent-tint">
                <Image
                  src={coverImage}
                  alt="Vista previa de la portada"
                  fill
                  unoptimized
                  sizes="(max-width: 640px) 100vw, 640px"
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage("")}
                  aria-label="Quitar la foto de portada"
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-md"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <label className="mt-2 flex h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-line bg-soft text-sm font-semibold text-muted transition hover:border-accent/50 hover:text-accent">
                <Camera className="h-6 w-6" aria-hidden="true" />
                Elegir foto (JPG, PNG o WebP)
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onCoverChange}
                  className="sr-only"
                />
              </label>
            )}
            {coverError ? (
              <p className="mt-2 text-xs font-semibold text-accent">{coverError}</p>
            ) : null}
          </div>

          <Field label="Horario" helper="Opcional. Ej. Lun–Sáb · 8:00 a. m. – 9:00 p. m.">
            <input
              value={form.hours}
              onChange={(event) => set("hours", event.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Descripción" helper="Opcional. Qué ofreces y lo que te distingue.">
            <textarea
              value={form.description}
              onChange={(event) => set("description", event.target.value)}
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="font-display text-xl tracking-[-0.03em] text-ink">
            Ubicación <span className="text-accent" aria-hidden="true">*</span>
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Municipio" required>
              <input
                required
                value={form.municipality}
                onChange={(event) => set("municipality", event.target.value)}
                placeholder="Ej. Miranda"
                className={inputClass}
              />
            </Field>
            <Field label="Parroquia" required>
              <input
                required
                value={form.parish}
                onChange={(event) => set("parish", event.target.value)}
                placeholder="Ej. Santa Ana"
                className={inputClass}
              />
            </Field>
            <Field label="Sector (opcional)">
              <input
                value={form.sector}
                onChange={(event) => set("sector", event.target.value)}
                placeholder="Ej. Centro"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={useCurrentLocation}
              disabled={locating}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-beige px-4 text-sm font-semibold text-ink transition hover:bg-[#ebe0d4] disabled:opacity-60"
            >
              <LocateFixed className="h-4 w-4 text-accent" aria-hidden="true" />
              {locating ? "Obteniendo ubicación…" : "Usar mi ubicación actual"}
            </button>
            <p className="text-[11px] leading-4 text-muted">
              Toca el mapa o arrastra el marcador para ajustar la ubicación.
            </p>
          </div>

          <LocationPicker
            value={form.location}
            onChange={(point) => applyLocation(point)}
          />

          {form.location ? (
            <p className="text-[11px] font-semibold text-open">
              Ubicación marcada: {form.location.lat.toFixed(5)},{" "}
              {form.location.lng.toFixed(5)}
            </p>
          ) : null}

          <Field
            label="Dirección"
            required
            helper={
              addressLoading
                ? "Buscando la dirección del punto marcado…"
                : "Se completa desde el mapa. Puedes editarla."
            }
          >
            <input
              required
              value={form.address}
              onChange={(event) => set("address", event.target.value)}
              placeholder="Calle, casa o edificio y referencia"
              className={inputClass}
            />
          </Field>
        </section>

        <section className="space-y-4 rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
          <h2 className="font-display text-xl tracking-[-0.03em] text-ink">
            Tus datos de contacto
          </h2>
          <Field label="Nombre del responsable" required>
            <input
              required
              value={form.ownerName}
              onChange={(event) => set("ownerName", event.target.value)}
              className={inputClass}
            />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Correo" required helper="Aquí recibirás la respuesta y tus accesos.">
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => set("email", event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Teléfono" required>
              <input
                required
                type="tel"
                value={form.phone}
                onChange={(event) => set("phone", event.target.value)}
                placeholder="0268-0000000"
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="WhatsApp con código de país" required helper="Solo números. Ej. 584121234567">
            <input
              required
              inputMode="numeric"
              value={form.whatsapp}
              onChange={(event) => set("whatsapp", event.target.value)}
              className={inputClass}
            />
          </Field>
        </section>

        <section className="rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
          <label className="flex items-start gap-3 text-sm leading-6 text-ink">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(event) => setTermsAccepted(event.target.checked)}
              className="mt-1.5 h-4 w-4 shrink-0 accent-[#C9410F]"
            />
            <span>
              He leído y acepto los{" "}
              <Link href="/terminos" target="_blank" className="font-semibold text-accent underline">
                Términos y Condiciones
              </Link>{" "}
              y la{" "}
              <Link href="/privacidad" target="_blank" className="font-semibold text-accent underline">
                Política de Privacidad
              </Link>
              , incluido el tratamiento de los datos y la ubicación de mi negocio.
              <span className="ml-1 font-semibold text-accent" aria-hidden="true">*</span>
            </span>
          </label>
        </section>

        <div className="rounded-[24px] bg-amber-tint p-4 text-xs leading-5 text-[#6a4700]">
          La solicitud no crea acceso inmediato. El equipo revisa cada negocio
          antes de aprobarlo.
        </div>

        {error ? (
          <p className="rounded-2xl bg-accent-tint p-3 text-sm font-semibold text-accent">
            {error}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={submitting || !termsAccepted}>
          {submitting ? "Enviando…" : "Enviar solicitud"}
        </Button>
      </form>
    </div>
  );
}
