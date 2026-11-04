import type { Metadata } from "next";
import { Akshar, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { MotionLayer } from "@/components/motion-layer";

const display = Akshar({ subsets: ["latin"], variable: "--font-display", weight: ["500", "600", "700"] });
const body = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-body", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: { default: "3DCreativeLab | Impresión 3D", template: "%s | 3DCreativeLab" },
  description: "Objetos impresos en 3D y fabricación personalizada en Colombia.",
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO">
      <body className={`${display.variable} ${body.variable}`}><MotionLayer />{children}</body>
    </html>
  );
}
