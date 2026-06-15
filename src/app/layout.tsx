import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DevCommands Hub — All Programming Commands",
  description:
    "All programming commands for Python, C, C++, Java, JavaScript, TypeScript, Go, Rust, frameworks, AI/ML tools and more in one place.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen" style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}>
        {children}
      </body>
    </html>
  );
}
