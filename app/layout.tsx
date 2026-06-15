import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SITE_URL, OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT } from "./lib/site";
import { GoogleAnalytics } from "@next/third-parties/google";

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
  title: "Pomodoro Timer — Free, Minimal Timer & Lofi Radio",
  description:
    "Free, minimal and customizable Pomodoro timer. Includes a to-do list and a lofi music player to help you focus and work productively.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "Pomodoro Timer — Free, Minimal Timer & Lofi Radio",
    description: "Free, minimal and customizable Pomodoro timer. Includes a to-do list and a lofi music player to help you focus and work productively.",
    url: SITE_URL,
    siteName: "Pomodoro Timer",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: OG_IMAGE,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: "Pomodoro Timer — Free Timer & Lofi Radio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro Timer — Free, Minimal Timer & Lofi Radio",
    description: "Free, minimal and customizable Pomodoro timer. Includes a to-do list and a lofi music player to help you focus and work productively.",
    images: [OG_IMAGE],
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
    "name": "Pomodoro Timer",
    "url": SITE_URL,
    "description": "Free, minimal and customizable Pomodoro timer. Includes a to-do list and a lofi music player to help you focus and work productively.",
    "applicationCategory": "ProductivityApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en" className={`scroll-smooth min-h-full antialiased ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-accent/30 transition-colors duration-500">
        {children}
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  );
}
