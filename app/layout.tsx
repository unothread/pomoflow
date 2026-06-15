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
    "Çalışma veriminizi artırmak için ücretsiz ve sade Pomodoro sayacı. Ayarlanabilir zamanlayıcı, mola döngüleri, entegre yapılacaklar listesi ve odaklanmayı kolaylaştıran Lofi müzik çalar.",
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
  return (
    <html lang="tr" className={`scroll-smooth min-h-full antialiased ${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans selection:bg-accent/30 transition-colors duration-500">
        {children}
      </body>
    </html>
  );
}
