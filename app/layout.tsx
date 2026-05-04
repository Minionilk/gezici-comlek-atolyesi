import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gezici Çömlekçi Çarkı Atölyesi",
  description:
    "Barış Özarıkça ve Hayri Ünal ile okullar, oteller, kurumlar ve etkinlikler için yerinde kurulan seramik çarkı deneyimi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Nunito:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-sand-50 text-charcoal-800">
        {children}
      </body>
    </html>
  );
}
