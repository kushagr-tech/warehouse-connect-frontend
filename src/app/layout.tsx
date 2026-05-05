import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Warehouse Connect — B2B Industrial Space Marketplace",
  description: "Find and list warehouse space across India. Cold storage, bonded, dry storage — all compliance-verified.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
