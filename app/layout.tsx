import type { Metadata, Viewport } from "next";
import { RevealObserver } from "@/components/reveal-observer";
import "@fontsource/dm-sans/300.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/italiana/400.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Tattoin — Custom Tattoo Studio in Bali", template: "%s · Tattoin" },
  description: "A private tattoo studio in Bali creating considered blackwork, fine-line, Japanese, and ornamental tattoos. Custom work, calm process, lasting craft.",
  keywords: ["tattoo studio Bali", "Bali tattoo artist", "custom tattoo", "blackwork tattoo", "fine line tattoo", "tattoo Indonesia"],
  authors: [{ name: "Tattoin Studio" }],
  creator: "Tattoin Studio",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Tattoin Studio",
    title: "Tattoin — Stories Made Permanent",
    description: "Custom tattooing shaped around your story, body, and rhythm.",
    images: [{ url: "/images/hero-studio.png", width: 1672, height: 941, alt: "Artist tattooing in the Tattoin studio" }],
  },
  twitter: { card: "summary_large_image", title: "Tattoin — Stories Made Permanent", description: "Custom tattooing in Bali.", images: ["/images/hero-studio.png"] },
  robots: { index: true, follow: true },
  category: "Tattoo studio",
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skipLink" href="#main-content">Skip to content</a>
        <RevealObserver />
        {children}
      </body>
    </html>
  );
}
