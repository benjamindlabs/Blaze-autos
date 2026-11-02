import type { Metadata } from "next";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import MagneticCursor from "@/components/MagneticCursor";

export const metadata: Metadata = {
  title: "Blaze Autos | Luxury Automotive Atelier",
  description: "Curated hypercars, bespoke performance SUVs, and private allocations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-black" suppressHydrationWarning>
      <body
        className="min-h-full bg-black text-white antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <MagneticCursor />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
