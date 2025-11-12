"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "next-themes";
import { ConvexClientProvider } from "./providers";
import { ImageKitProvider } from "@imagekit/next";
import { AIChatProvider, useAIChat } from "@/contexts/ai-chat-context";
import { AIChatOverlay } from "@/components/ai-chat-overlay";
import { MorphingPopover } from "@/components/motion-primitives/morphing-popover";

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

function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen, setIsOpen } = useAIChat();
  
  return (
    <MorphingPopover open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <AIChatOverlay />
    </MorphingPopover>
  );
}

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
                <LayoutContent>
                  {children}
                </LayoutContent>
              </AIChatProvider>
            </ThemeProvider>
          </ImageKitProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
