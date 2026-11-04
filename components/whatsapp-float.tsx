import { buildWhatsAppUrl } from "@/lib/format";

export function WhatsAppFloat() {
  return <a className="whatsapp-float" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer" aria-label="Consultar por WhatsApp">WA</a>;
}

