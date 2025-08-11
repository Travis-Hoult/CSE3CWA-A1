"use client";
export default function ThemeToggle() {
  const btn: React.CSSProperties = {
    padding: "8px 10px",
    border: "1px solid #ccc",
    background: "var(--card)",
    borderRadius: 8,
    cursor: "pointer",
  };
  return <button style={btn} aria-label="Theme toggle">🌓</button>;
}
