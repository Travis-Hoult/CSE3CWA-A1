"use client";
import Menu from "./Menu";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const bar: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 16px",
  };

  const left: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 12,
    minWidth: 0,
  };

  const badge: React.CSSProperties = {
    padding: "4px 8px",
    background: "#000",
    color: "#fff",
    fontSize: 12,
    borderRadius: 6,
    whiteSpace: "nowrap",
  };

  const title: React.CSSProperties = {
    fontWeight: 600,
    overflow: "hidden",
    textOverflow: "ellipsis",
  };

  const right: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <header style={bar}>
      <div style={left}>
        <span style={badge}>Student #20221016</span>
        <div style={title}>CSE3CWA — Assignment 1</div>
      </div>
      <div style={right}>
        <ThemeToggle />
        <Menu />
      </div>
    </header>
  );
}

