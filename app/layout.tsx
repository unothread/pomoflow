import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pomoflow — sade pomodoro + lofi",
  description:
    "Ayarlanabilir pomodoro zamanlayıcı, kısa/uzun mola döngüsü, Lofi radyo ve yapılacaklar listesi. Tek sayfa, mobil uyumlu.",
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
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900">
        {children}
      </body>
    </html>
  );
}
