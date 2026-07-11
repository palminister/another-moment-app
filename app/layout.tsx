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

const appleStartupImages = [
  {
    href: "/splash/iphone-se-portrait.png",
    media:
      "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    href: "/splash/iphone-8-portrait.png",
    media:
      "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    href: "/splash/iphone-8-plus-portrait.png",
    media:
      "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    href: "/splash/iphone-xr-portrait.png",
    media:
      "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    href: "/splash/iphone-x-portrait.png",
    media:
      "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    href: "/splash/iphone-12-portrait.png",
    media:
      "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    href: "/splash/iphone-14-pro-portrait.png",
    media:
      "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    href: "/splash/iphone-14-pro-max-portrait.png",
    media:
      "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
  },
  {
    href: "/splash/ipad-mini-portrait.png",
    media:
      "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    href: "/splash/ipad-air-portrait.png",
    media:
      "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    href: "/splash/ipad-pro-11-portrait.png",
    media:
      "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
  {
    href: "/splash/ipad-pro-12-portrait.png",
    media:
      "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
  },
];

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
  themeColor: "#FFE4B3",
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {appleStartupImages.map((image) => (
          <link
            key={image.href}
            rel="apple-touch-startup-image"
            href={image.href}
            media={image.media}
          />
        ))}
      </head>
      <body className={`${palmSerif.variable} ${bioRhymeExpanded.variable}`}>{children}</body>
    </html>
  );
}
