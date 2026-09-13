import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DesignLab AI",
  description: "Practice LLD. Get intelligent feedback. Improve your design.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
