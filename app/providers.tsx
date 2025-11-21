"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { ImageKitProvider } from "@imagekit/next";
import { AIChatProvider } from "@/contexts/ai-chat-context";
import { AIChatPopover } from "@/components/ai-chat-popover";
import { LayoutGroup } from "motion/react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ConvexProvider client={convex}>
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
              {children}
            </LayoutGroup>
            <AIChatPopover />
          </AIChatProvider>
        </ThemeProvider>
      </ImageKitProvider>
    </ConvexProvider>
  );
}
