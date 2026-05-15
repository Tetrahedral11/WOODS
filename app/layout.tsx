
// app/layout.tsx
import "./globals.css";

import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "WOODS",
  description: "Modern multilingual QR menu",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


