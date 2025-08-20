// components/Menu.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { setCookie, getCookie } from "@/lib/cookies";

export default function Menu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape & click outside
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    }
    function onClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  // Read last visited page cookie to pre-highlight
  const last = getCookie("lastMenu") ?? "/";

  const buttonStyle: React.CSSProperties = {
    padding: "8px 10px",
    border: "none",                 // no border (per your request)
    background: "var(--card)",
    borderRadius: 8,
    cursor: "pointer",
    transform: open ? "rotate(90deg)" : "rotate(0deg)",
    transition: "transform 120ms ease",
    color: "var(--fg)",             // hamburger glyph follows theme
    lineHeight: 0,
  };

  const listStyle: React.CSSProperties = {
    position: "absolute",
    right: 16,
    top: 48,
    background: "var(--bg)",
    border: "1px solid #ddd",
    borderRadius: 10,
    boxShadow: "0 10px 24px rgba(0,0,0,.12)",
    padding: 8,
    display: open ? "block" : "none",
    minWidth: 160,
  };

  const linkStyle = (href: string): React.CSSProperties => ({
    display: "block",
    padding: "8px 12px",
    borderRadius: 8,
    textDecoration: "none",
    color: "var(--fg)",
    fontWeight: last === href ? 700 : 400, // bold the last visited
    outlineOffset: 2,
  });

  function handleNav(href: string) {
    setCookie("lastMenu", href, 30); // remember last menu path for 30 days
    setOpen(false);
  }

  return (
    <div style={{ position: "relative" }} ref={menuRef}>
      <button
        id="menu-button"
        ref={btnRef}
        aria-label="Open menu"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="mainnav"
        onClick={() => setOpen((v) => !v)}
        style={buttonStyle}
      >
        {/* Hamburger glyph inherits color via currentColor (button's color) */}
        <span aria-hidden="true" style={{ fontSize: 20 }}>☰</span>
      </button>

      {/* Plain nav semantics (no menu roles) */}
      <nav id="mainnav" aria-labelledby="menu-button" style={listStyle}>
        <Link href="/" style={linkStyle("/")} onClick={() => handleNav("/")}>
          Home
        </Link>
        <Link href="/about" style={linkStyle("/about")} onClick={() => handleNav("/about")}>
          About
        </Link>
      </nav>
    </div>
  );
}
