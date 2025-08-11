import type { Metadata } from "next";
import "./globals.css";

import Header from "../components/Header";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "CSE3CWA A1",
  description: "Assignment 1 build",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const bodyStyle: React.CSSProperties = {
    margin: 0,
    background: "var(--bg, #ffffff)",
    color: "var(--fg, #111111)",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  };

  const badgeStyle: React.CSSProperties = {
    position: "fixed",
    top: 8,
    left: 8,
    padding: "4px 8px",
    background: "#000",
    color: "#fff",
    fontSize: 12,
    zIndex: 9999,
    borderRadius: 4,
  };

  const mainStyle: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "16px",
  };

  return (
    <html lang="en">
      <body style={bodyStyle}>
        {/* Student number badge */}
        

        {/* theme tokens (used by ThemeToggle later) */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root { --bg:#ffffff; --fg:#111111; --card:#f5f5f5; --link:#0b5fff; }
              [data-theme="dark"] { --bg:#111111; --fg:#f7f7f7; --card:#1c1c1c; --link:#70a0ff; }
            `,
          }}
        />

        {/* Header */}
        <div style={{ borderBottom: "1px solid #ddd", position: "sticky", top: 0, background: "var(--bg)", zIndex: 2 }}>
          <Header />
        </div>

        {/* Page content */}
        <main style={mainStyle}>{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
