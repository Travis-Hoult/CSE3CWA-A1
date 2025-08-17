"use client";


import { useEffect, useState } from "react";

type Theme = "light" | "dark";


const THEME_KEY = "theme";


function readSavedTheme(): Theme | null {
  try {
    const v = localStorage.getItem(THEME_KEY);
    return v === "dark" || v === "light" ? v : null;
  } catch {
    return null;
  }
}


function applyTheme(theme: Theme) {
  if (typeof document !== "undefined") {
    document.documentElement.dataset.theme = theme;
  }
}

export default function ThemeToggle() {

  const [theme, setTheme] = useState<Theme | undefined>(undefined);

  
  useEffect(() => {
    const saved = readSavedTheme() ?? "light";
    setTheme(saved);
    applyTheme(saved);
  }, []);

 
  useEffect(() => {
    if (!theme) return;
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
    applyTheme(theme);
  }, [theme]);


  if (!theme) {
    return (
      <button
        aria-label="Theme toggle"
        title="Theme"
        style={{
          padding: "8px 10px",
          border: "1px solid #ccc",
          background: "var(--card)",
          borderRadius: 8,
          cursor: "pointer",
        }}
        disabled
      >
        🌓
      </button>
    );
  }

  const next = theme === "light" ? "dark" : "light";
  const label = theme === "light" ? "Switch to dark mode" : "Switch to light mode";

  return (
    <button
      aria-label={label}
      title={label}
      onClick={() => setTheme(next)}
      style={{
        padding: "8px 10px",
        border: "1px solid #ccc",
        background: "var(--card)",
        borderRadius: 8,
        cursor: "pointer",
      }}
    >
      {theme === "light" ? "🌞" : "🌙"}
    </button>
  );
}
