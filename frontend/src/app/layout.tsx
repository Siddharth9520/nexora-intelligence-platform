import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NEXORA — Evidence Intelligence & Relationship Analysis Platform",
  description:
    "AI-assisted evidence intelligence and relationship analysis platform. Every Connection Reveals a Clue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-nexora-void text-nexora-text bg-grid-pattern selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
