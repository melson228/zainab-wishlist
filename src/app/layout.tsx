import type { Metadata } from "next";
import { body, display } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Марсель & Зайнаб · Gender Party",
  description: "Вишлист и детали гендер-пати Марселя и Зайнаб",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
