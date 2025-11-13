"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "next-themes";
import { ConvexClientProvider } from "./providers";
import { ImageKitProvider } from "@imagekit/next";
import { AIChatProvider } from "@/contexts/ai-chat-context";
import { AIChatPopover } from "@/components/ai-chat-popover";
import { LayoutGroup } from "motion/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// export const metadata: Metadata = {
//   title: "Mihai Crisan Personal Portfolio",
//   description: "Personal portfolio showcasing my projects and skills",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-background text-foreground`}
      >
        <ConvexClientProvider>
          <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem={false}
              disableTransitionOnChange
              storageKey="theme"
            >
              <AIChatProvider>
                <LayoutGroup>
                  <div className="flex flex-col min-h-screen">
                    <Navigation />
                    <main className="flex-1">
                      {children}
                    </main>
                    <Footer />
                  </div>
                </LayoutGroup>
                <AIChatPopover />
              </AIChatProvider>
            </ThemeProvider>
          </ImageKitProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
