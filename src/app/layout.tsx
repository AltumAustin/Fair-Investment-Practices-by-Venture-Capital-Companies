import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VC Compliance - Fair Investment Practices",
  description:
    "Compliance platform for California's Fair Investment Practices by Venture Capital Companies Law (Corp. Code § 27500 et seq.)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
