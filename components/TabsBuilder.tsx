"use client";

import { useEffect, useMemo, useState } from "react";

type Tab = { id: string; title: string; content: string };

const TABS_KEY = "tabs-data";

function makeTab(n: number): Tab {
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;
  return { id, title: `Tab ${n}`, content: "" };
}

function save<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const s = localStorage.getItem(key);
    return s ? (JSON.parse(s) as T) : fallback;
  } catch {
    return fallback;
  }
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function generateInlineHtml(tabs: Tab[]): string {
  const buttons = tabs
    .map((t, i) => {
      const on = i === 0;
      const label = t.title && t.title.trim() ? t.title : "Untitled";
      return `<button role="tab" data-tab="${
        t.id
      }" aria-selected="${on}" style="padding:8px 12px;border:1px solid #999;border-radius:8px;background:${
        on ? "#1d8346ff" : "#89268bff"
      };cursor:pointer;">${escapeHtml(label)}</button>`;
    })
    .join("");

  const panels = tabs
    .map((t, i) => {
      const on = i === 0;
      const contentHtml = escapeHtml(t.content).replaceAll("\n", "<br/>");
      return `<div role="tabpanel" data-panel="${
        t.id
      }" style="border:1px solid #ddd;border-radius:10px;padding:12px;${
        on ? "" : "display:none"
      }">${contentHtml}</div>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Tabs Output</title>
</head>
<body style="margin:16px;font-family:system-ui,Arial,sans-serif;color:#111;background:#fff;">
  <div id="tabs" style="max-width:900px;margin:0 auto;">
    <h1 style="font-size:20px;margin:0 0 12px 0;">Tabs Output</h1>
    <div role="tablist" aria-label="Generated tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">
      ${buttons}
    </div>
    ${panels}
  </div>
  <script>
    (function(){
      var tabs = Array.from(document.querySelectorAll('[role="tab"]'));
      var panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
      function activate(id){
        tabs.forEach(function(t){
          var on = t.getAttribute('data-tab') === id;
          t.setAttribute('aria-selected', on ? 'true' : 'false');
          t.style.background = on ? '#1d8346ff' : '#89268bff';
        });
        panels.forEach(function(p){
          var on = p.getAttribute('data-panel') === id;
          p.style.display = on ? 'block' : 'none';
        });
      }
      tabs.forEach(function(t){
        t.addEventListener('click', function(){ activate(t.getAttribute('data-tab')); });
      });
      if (tabs[0]) activate(tabs[0].getAttribute('data-tab'));
    })();
  </script>
</body>
</html>`;
}

export default function TabsBuilder() {
  const initial = useMemo<Tab[]>(() => load<Tab[]>(TABS_KEY, [makeTab(1)]), []);
  const [tabs, setTabs] = useState<Tab[]>(initial);
  const [activeId, setActiveId] = useState<string>(initial[0].id);
  const [outputHtml, setOutputHtml] = useState<string>("");

  useEffect(() => {
    const t = setTimeout(() => save(TABS_KEY, tabs), 200);
    return () => clearTimeout(t);
  }, [tabs]);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  function addTab() {
    if (tabs.length >= 15) return;
    const t = makeTab(tabs.length + 1);
    setTabs((prev) => [...prev, t]);
    setActiveId(t.id);
  }

  function removeActive() {
    if (tabs.length <= 1) return;
    const idx = tabs.findIndex((t) => t.id === activeId);
    const remaining = tabs.filter((t) => t.id !== activeId);
    const nextIdx = Math.max(0, idx - 1);
    setTabs(remaining);
    setActiveId(remaining[nextIdx]?.id ?? remaining[0].id);
  }

  function updateTitle(id: string, title: string) {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  }

  function updateContent(id: string, content: string) {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, content } : t)));
  }

  function copyOutput() {
    if (!outputHtml) return;
    navigator.clipboard?.writeText(outputHtml).catch(() => {});
  }

  function onGenerate() {
    console.log("Generate Output button clicked.");
    setTimeout(() => {
      console.log("Tabs state:", tabs);
      const html = generateInlineHtml(tabs);
      console.log("Generated HTML:", html);
      setOutputHtml(html);
    }, 0);
  }

  const wrap: React.CSSProperties = { display: "grid", gap: 12 };
  const controls: React.CSSProperties = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  };
  const tablist: React.CSSProperties = {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  };
  const tabBtn = (on: boolean): React.CSSProperties => ({
    padding: "8px 12px",
    border: "1px solid #999",
    borderRadius: 8,
    background: on ? "#1d8346ff" : "#89268bff",
    cursor: "pointer",
  });
  const panel: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 12,
  };

  return (
    <section style={wrap}>
      <div style={controls}>
        <button
          onClick={addTab}
          aria-label="Add tab"
          style={{
            padding: "8px 12px",
            border: "1px solid #999",
            borderRadius: 8,
            background: "#e0e0e0",
            color: "#111",
            cursor: "pointer",
          }}
          disabled={tabs.length >= 15}
        >
          + Add Tab ({tabs.length}/15)
        </button>
        <button
          onClick={removeActive}
          aria-label="Remove active tab"
          style={{
            padding: "8px 12px",
            border: "1px solid #999",
            borderRadius: 8,
            background: "#e0e0e0",
            color: "#111",
            cursor: "pointer",
          }}
          disabled={tabs.length <= 1}
        >
          − Remove Active
        </button>
      </div>

      <div role="tablist" aria-label="Tabs" style={tablist}>
        {tabs.map((t) => {
          const on = t.id === activeId;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={on}
              onClick={() => setActiveId(t.id)}
              style={tabBtn(on)}
            >
              {t.title && t.title.trim() ? t.title : "Untitled"}
            </button>
          );
        })}
      </div>

      {active && (
        <div role="tabpanel" aria-label="Active tab content" style={panel}>
          <div style={{ display: "grid", gap: 8 }}>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>
                Tab title
              </span>
              <input
                value={active.title}
                onChange={(e) => updateTitle(active.id, e.target.value)}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                }}
              />
            </label>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>
                Tab content
              </span>
              <textarea
                value={active.content}
                onChange={(e) => updateContent(active.id, e.target.value)}
                rows={6}
                style={{
                  width: "100%",
                  padding: 8,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                }}
              />
            </label>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={onGenerate}
            style={{
              padding: "8px 12px",
              border: "1px solid #999",
              borderRadius: 8,
              background: "#e0e0e0",
              color: "#111",
              cursor: "pointer",
            }}
            aria-label="Generate standalone HTML"
          >
            Generate Output (inline HTML)
          </button>
          <button
            onClick={copyOutput}
            style={{
              padding: "8px 12px",
              border: "1px solid #999",
              borderRadius: 8,
              background: "#e0e0e0",
              color: "#111",
              cursor: "pointer",
            }}
            aria-label="Copy generated HTML to clipboard"
            disabled={!outputHtml}
          >
            Copy Output
          </button>
        </div>
        <textarea
          value={outputHtml}
          readOnly
          placeholder="Click 'Generate Output' to see the HTML here. Copy & paste this into a .html file and open it in a browser."
          rows={10}
          style={{
            width: "100%",
            padding: 8,
            border: "1px solid #ccc",
            borderRadius: 8,
            fontFamily: "ui-monospace, Menlo, Consolas, monospace",
            fontSize: 12,
          }}
        />
      </div>
    </section>
  );
}
