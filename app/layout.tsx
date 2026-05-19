import { GeistPixelSquare } from "geist/font/pixel";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalChrome } from "@/components/global-chrome";
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
        className={`${geistSans.variable} ${geistMono.variable} ${GeistPixelSquare.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <Providers>
          <main className="relative z-10 min-h-svh">{children}</main>
          <GlobalChrome />
        </Providers>
      </body>
    </html>
  );
}
