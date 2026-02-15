import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VC Comply - Venture Capital Demographic Compliance",
  description:
    "Compliance platform for California's Fair Investment Practices by Venture Capital Companies Law (Corp. Code § 27500 et seq.)",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "VC Comply",
    description: "Venture Capital Demographic Compliance, Simplified",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1B365D" />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
