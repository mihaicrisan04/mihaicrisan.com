import localFont from "next/font/local";

// Only the Square variant is used (year labels on /work). Vendored from the
// `geist` package so the other four pixel variants never get preloaded.
export const geistPixel = localFont({
  src: "./fonts/GeistPixel-Square.woff2",
  variable: "--font-geist-pixel-square",
  weight: "500",
  adjustFontFallback: false,
});
