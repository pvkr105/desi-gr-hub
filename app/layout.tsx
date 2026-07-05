import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { StickyJoinBar } from "@/components/StickyJoinBar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}: Indian & South Asian Community in Grand Rapids, MI`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: `${site.name}: Indian & South Asian Community in Grand Rapids, MI`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}: Indian & South Asian Community in Grand Rapids, MI`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-dvh font-sans antialiased">
        <Header />
        {/* pb accounts for the mobile sticky join bar so content isn't hidden. */}
        <main className="mx-auto w-full max-w-5xl px-4 pb-28 pt-6 sm:px-6 md:pb-16">
          {children}
        </main>
        <Footer />
        <StickyJoinBar />
      </body>
    </html>
  );
}
