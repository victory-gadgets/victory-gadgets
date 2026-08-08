import type { Metadata } from "next";
import "./globals.css";

const repository = process.env.GITHUB_REPOSITORY?.split("/");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (repository ? `https://${repository[0]}.github.io/${repository[1]}/` : "http://localhost:3000/");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Victory Gadgets | Quality Gadgets, Better Life",
  description: "Shop market-specific Victory Gadgets inventory in Nigeria, Canada, and the United States with local pricing and direct support.",
  alternates: { canonical: "/" },
  icons: { icon: "favicon.svg" },
  openGraph: {
    title: "Victory Gadgets | Quality Gadgets, Better Life",
    description: "Choose Nigeria, Canada, or the United States to browse local inventory, photos, availability, and pricing.",
    type: "website",
    url: "/",
    images: [{ url: "og-markets.png", width: 1200, height: 630, alt: "Victory Gadgets serving Nigeria, Canada, and the United States" }],
  },
  twitter: { card: "summary_large_image", images: ["og-markets.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
