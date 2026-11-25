import { Cormorant_Garamond, Great_Vibes, Manrope } from "next/font/google";

export const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
});

export const body = Manrope({
  variable: "--font-body",
  subsets: ["latin", "latin-ext", "cyrillic"],
});

/** Свадебная каллиграфия Great Vibes (есть кириллица) */
export const scriptFont = Great_Vibes({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: "400",
});
