import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pomodoro — Ücretsiz, Sade Zamanlayıcı ve Lofi Radyo",
  description:
    "Ücretsiz, sade ve ayarlanabilir Pomodoro sayacı. Verimli çalışmak için görev listesi ve odaklanmayı kolaylaştıran lofi müzik çalar içerir.",
  metadataBase: new URL('https://pomoflow.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Pomodoro — Ücretsiz, Sade Zamanlayıcı ve Lofi Radyo",
    description: "Ücretsiz, sade ve ayarlanabilir Pomodoro sayacı. Verimli çalışmak için görev listesi ve odaklanmayı kolaylaştıran lofi müzik çalar içerir.",
    url: "https://pomoflow.com",
    siteName: "Pomodoro",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro — Ücretsiz, Sade Zamanlayıcı ve Lofi Radyo",
    description: "Ücretsiz, sade ve ayarlanabilir Pomodoro sayacı. Verimli çalışmak için görev listesi ve odaklanmayı kolaylaştıran lofi müzik çalar içerir.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#fafafa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Pomodoro",
    "description": "Ücretsiz, sade ve ayarlanabilir Pomodoro sayacı. Verimli çalışmak için görev listesi ve odaklanmayı kolaylaştıran lofi müzik çalar içerir.",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <html lang="tr" className={`scroll-smooth min-h-full antialiased ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-accent/30 transition-colors duration-500">
        {children}
      </body>
    </html>
  );
}
