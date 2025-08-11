"use client";
import Link from "next/link";
import { useState } from "react";

export default function Menu() {
  const [open, setOpen] = useState(false);

  const buttonStyle: React.CSSProperties = {
    padding: "8px 10px",
    border: "1px solid #ccc",
    background: "var(--card)",
    borderRadius: 8,
    cursor: "pointer",
    transform: open ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 120ms ease",
  };

  const listStyle: React.CSSProperties = {
    position: "absolute",
    right: 16,
    top: 48,
    background: "var(--bg)",
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 8,
    display: open ? "block" : "none",
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        aria-label="Open menu"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="mainnav"
        onClick={() => setOpen(v => !v)}
        style={buttonStyle}
      >
        ☰
      </button>
      <nav id="mainnav" style={listStyle} role="menu">
        <Link href="/" onClick={() => setOpen(false)}>Home</Link><br />
        <Link href="/about" onClick={() => setOpen(false)}>About</Link>
      </nav>
    </div>
  );
}
