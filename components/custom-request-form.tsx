"use client";

import { useState, type FormEvent } from "react";
import { buildWhatsAppUrl } from "@/lib/format";

export function CustomRequestForm() {
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const contact = String(form.get("contact") || "").trim();
    const description = String(form.get("description") || "").trim();
    const measures = String(form.get("measures") || "").trim();
    const city = String(form.get("city") || "").trim();
    if (name.length < 2 || contact.length < 7 || description.length < 10 || measures.length < 2 || city.length < 2) {
      setError("Completa tu nombre, contacto, descripción, medidas y ciudad de entrega.");
      return;
    }
    setError("");
    const material = String(form.get("material") || "Por definir");
    const quantity = String(form.get("quantity") || "1");
    const reference = String(form.get("reference") || "Sin enlace").trim() || "Sin enlace";
    window.open(buildWhatsAppUrl(`Hola 3DCreativeLab. Soy ${name} y quiero cotizar una pieza personalizada.\n\nContacto: ${contact}\nIdea/uso: ${description}\nMedidas: ${measures}\nCantidad: ${quantity}\nCiudad de entrega: ${city}\nMaterial preferido: ${material}\nReferencias adicionales: ${reference}\n\nPor favor confirma viabilidad, precio y entrega.`), "_blank", "noopener,noreferrer");
  }
  return (
    <form className="custom-form" onSubmit={submit} noValidate>
      <label>Nombre<input name="name" autoComplete="name" required minLength={2} /></label>
      <div className="form-row"><label>Contacto<input name="contact" autoComplete="tel" required minLength={7} placeholder="Teléfono o correo" /></label><label>Ciudad de entrega<input name="city" autoComplete="address-level2" required minLength={2} /></label></div>
      <label>¿Qué necesitas?<textarea name="description" rows={5} required minLength={10} placeholder="Cuéntanos para qué se usará la pieza…" /></label>
      <div className="form-row"><label>Medidas aproximadas<input name="measures" required placeholder="Ej. 12 × 8 × 4 cm" /></label><label>Cantidad<input name="quantity" type="number" min="1" max="999" defaultValue="1" required /></label></div>
      <label>Material preferido<select name="material"><option>Por definir</option><option>PLA</option><option>PETG</option><option>TPU flexible</option><option>Otro</option></select></label>
      <label>Enlace a archivo o referencia <span>(opcional)</span><input name="reference" type="url" inputMode="url" placeholder="https://…" /></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button-light" type="submit">Continuar por WhatsApp →</button>
      <small>No se envía ningún archivo desde este formulario. WhatsApp se abrirá con el resumen para que adjuntes tu referencia de forma privada.</small>
    </form>
  );
}

