import type { Metadata, Viewport } from "next";
import { BioRhyme_Expanded } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const palmSerif = localFont({
  src: "./fonts/PalmSerif-VF.ttf",
  variable: "--font-palm-serif",
  display: "swap",
});

const bioRhymeExpanded = BioRhyme_Expanded({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-biorhyme-expanded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Another Moment",
  description: "A shared-balance calculator for choosing the next moment together.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Another Moment",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${palmSerif.variable} ${bioRhymeExpanded.variable}`}>{children}</body>
    </html>
  );
}
