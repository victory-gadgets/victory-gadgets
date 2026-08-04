import type { Metadata } from "next";
import "./globals.css";

const repository = process.env.GITHUB_REPOSITORY?.split("/");
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (repository ? `https://${repository[0]}.github.io/${repository[1]}/` : "http://localhost:3000/");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Victory Gadgets | Quality Gadgets, Better Life",
  description: "Shop original gadgets, accessories, appliances and more with clear pricing and worldwide delivery.",
  icons: { icon: "favicon.svg" },
  openGraph: {
    title: "Victory Gadgets | Quality Gadgets, Better Life",
    description: "Original gadgets and accessories, ready for pickup or worldwide delivery.",
    type: "website",
    images: [{ url: "og.png", width: 1200, height: 630, alt: "Victory Gadgets product collection" }],
  },
  twitter: { card: "summary_large_image", images: ["og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
