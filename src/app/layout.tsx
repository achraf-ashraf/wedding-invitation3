import type { Metadata } from "next";
import { Amiri, Aref_Ruqaa, Reem_Kufi, Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Luxury Arabic font stack
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

const arefRuqaa = Aref_Ruqaa({
  variable: "--font-aref-ruqaa",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const reemKufi = Reem_Kufi({
  variable: "--font-reem-kufi",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "دعوة زفاف | أشرف و آمنة",
  description: "تتشرف عائلة خالد بن روينة بدعوتكم لحضور حفل زفاف ابنهم أشرف على آمنة التريكي — 24 جويلية 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body
        className={`${amiri.variable} ${arefRuqaa.variable} ${reemKufi.variable} ${cairo.variable} antialiased overflow-x-hidden`}
        style={{ fontFamily: 'var(--font-amiri)' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
