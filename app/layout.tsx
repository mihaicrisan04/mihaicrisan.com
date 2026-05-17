import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FooterSlot } from "@/components/footer-slot";
import { ShaderSlot } from "@/components/shader-slot";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mihai crisan",
  description: "software engineer, cluj-napoca",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="scroll-smooth" lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <Providers>
          <ShaderSlot />
          <div className="relative z-10 flex flex-col">
            <main className="min-h-svh">{children}</main>
            <FooterSlot />
          </div>
        </Providers>
      </body>
    </html>
  );
}
