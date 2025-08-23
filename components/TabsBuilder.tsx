"use client";

import { useEffect, useState } from "react";

// Week 3–4 (TypeScript + React state): typed shape for a tab item
type Tab = { id: string; title: string; content: string };

// Week 4 (Browser APIs → localStorage): single key for persistence
const TABS_KEY = "tabs-data";

// Week 4 (List CRUD): quick id generator (simple + readable)
function makeId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

// Week 4 (Output / Security): escape content used inside HTML
function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

// Week 4 (Output Button requirement): produce standalone HTML with only inline CSS (no classes)
function generateInlineHtml(tabs: Tab[]): string {
  const buttons = tabs
    .map((t, i) => {
      const isFirst = i === 0;
      const label = t.title.trim() || `Untitled ${i + 1}`;
      // Minimal ARIA roles kept (Week 3 a11y intro); inline styles only (rubric)
      return `<button role="tab" data-target="panel-${i}" aria-selected="${isFirst ? "true" : "false"}"
  style="padding:8px 12px;border:1px solid #999;border-radius:8px;background:${isFirst ? "#1d8346" : "#89268b"};color:#fff;cursor:pointer">
  ${escapeHtml(label)}
</button>`;
    })
    .join("");

  const panels = tabs
    .map((t, i) => {
      const isFirst = i === 0;
      const content = escapeHtml(t.content).replaceAll("\n", "<br/>");
      return `<div id="panel-${i}" role="tabpanel"
  style="border:1px solid #ddd;border-radius:10px;padding:12px;${isFirst ? "" : "display:none"}">
  ${content}
</div>`;
    })
    .join("\n");

  // Self‑contained HTML (Week 4 “Output Button” demo pattern)
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Tabs Output</title>
</head>
<body style="margin:16px;font-family:system-ui,Arial,sans-serif;color:#111;background:#fff">
  <h1 style="font-size:20px;margin:0 0 12px 0">Tabs Output</h1>
  <div role="tablist" aria-label="Generated tabs" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
    ${buttons}
  </div>
  ${panels}
  <script>
    (function(){
      var tabs = Array.from(document.querySelectorAll('[role="tab"]'));
      var panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
      function show(targetId){
        tabs.forEach(function(btn){
          var on = btn.getAttribute('data-target') === targetId;
          btn.setAttribute('aria-selected', on ? 'true' : 'false');
          btn.style.background = on ? '#1d8346' : '#89268b';
        });
        panels.forEach(function(p){
          p.style.display = (p.id === targetId) ? 'block' : 'none';
        });
      }
      tabs.forEach(function(btn){
        btn.addEventListener('click', function(){
          show(btn.getAttribute('data-target'));
        });
      });
      if (tabs[0]) show(tabs[0].getAttribute('data-target'));
    })();
  </script>
</body>
</html>`;
}

export default function TabsBuilder() {
  // --- Hydration-safe persistence pattern ---

  // Default tab used for server render and the very first client render
  const DEFAULT_TABS: Tab[] = [{ id: makeId(), title: "Tab 1", content: "" }];

  // 1) Render defaults first so server HTML matches first client HTML (prevents hydration mismatch)
  const [tabs, setTabs] = useState<Tab[]>(DEFAULT_TABS);
  const [activeId, setActiveId] = useState<string>(DEFAULT_TABS[0].id);

  // Track when localStorage has been loaded (Week 4: localStorage)
  const [loaded, setLoaded] = useState(false);

  // 2) After mount, hydrate from localStorage (no SSR access to window/localStorage)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(TABS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Tab[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTabs(parsed);
          setActiveId(parsed[0].id);
        }
      }
    } catch {}
    setLoaded(true);
  }, []);

  // 3) Save to localStorage only after we've finished loading to avoid clobbering saved data
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(TABS_KEY, JSON.stringify(tabs));
    } catch {}
  }, [tabs, loaded]);

  // Derived active tab (Week 3: derived state)
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  // Week 4 (List CRUD): add / remove / edit
  function addTab() {
    if (tabs.length >= 15) return; // rubric: cap at 15
    const nextIndex = tabs.length + 1;
    const t: Tab = { id: makeId(), title: `Tab ${nextIndex}`, content: "" };
    setTabs((prev) => [...prev, t]);
    setActiveId(t.id);
  }

  function removeActive() {
    if (tabs.length <= 1) return; // keep at least one
    const remaining = tabs.filter((t) => t.id !== activeId);
    setTabs(remaining);
    setActiveId(remaining[0].id);
  }

  function updateTitle(id: string, title: string) {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
  }

  function updateContent(id: string, content: string) {
    setTabs((prev) => prev.map((t) => (t.id === id ? { ...t, content } : t)));
  }

  // Week 4 (Output Button): generate + copy
  const [outputHtml, setOutputHtml] = useState<string>("");

  function onGenerate() {
    const html = generateInlineHtml(tabs.slice(0, 15)); // safety cap (rubric)
    setOutputHtml(html);
  }

  function copyOutput() {
    if (!outputHtml) return;
    navigator.clipboard?.writeText(outputHtml).catch(() => {});
  }

  // Optional: hide initial default flash while hydrating (uncomment if desired)
  // if (!loaded) return null;

  // Inline styles (Week 2–3: inline styles; matches “inline-only” for exported HTML)
  const wrap: React.CSSProperties = { display: "grid", gap: 12 };
  const controls: React.CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap" };
  const tablist: React.CSSProperties = { display: "flex", gap: 8, flexWrap: "wrap" };
  const tabBtn = (on: boolean): React.CSSProperties => ({
    padding: "8px 12px",
    border: "1px solid #999",
    borderRadius: 8,
    background: on ? "#1d8346" : "#89268b",
    color: "#fff",
    cursor: "pointer",
  });
  const panel: React.CSSProperties = {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 12,
  };

  return (
    <section style={wrap}>
      {/* Week 4 (List CRUD): + / − with rubric limits */}
      <div style={controls}>
        <button
          onClick={addTab}
          aria-label="Add tab"
          style={{ padding: "8px 12px", border: "1px solid #999", borderRadius: 8, background: "#e0e0e0", color: "#111", cursor: "pointer" }}
          disabled={tabs.length >= 15}
        >
          + Add Tab ({tabs.length}/15)
        </button>
        <button
          onClick={removeActive}
          aria-label="Remove active tab"
          style={{ padding: "8px 12px", border: "1px solid #999", borderRadius: 8, background: "#e0e0e0", color: "#111", cursor: "pointer" }}
          disabled={tabs.length <= 1}
        >
          − Remove Active
        </button>
      </div>

      {/* Week 3 (A11y roles intro): minimal tablist semantics */}
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
              {t.title.trim() || "Untitled"}
            </button>
          );
        })}
      </div>

      {/* Week 3–4 (Controlled inputs): edit title/content */}
      {active && (
        <div role="tabpanel" aria-label="Active tab content" style={panel}>
          <div style={{ display: "grid", gap: 8 }}>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>Tab title</span>
              <input
                value={active.title}
                onChange={(e) => updateTitle(active.id, e.target.value)}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
              />
            </label>
            <label>
              <span style={{ display: "block", marginBottom: 4 }}>Tab content</span>
              <textarea
                value={active.content}
                onChange={(e) => updateContent(active.id, e.target.value)}
                rows={6}
                style={{ width: "100%", padding: 8, border: "1px solid #ccc", borderRadius: 8 }}
              />
            </label>
          </div>
        </div>
      )}

      {/* Week 4 (Output Button): generate + copy; textarea for your video demo */}
      <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            onClick={onGenerate}
            aria-label="Generate standalone HTML"
            style={{ padding: "8px 12px", border: "1px solid #999", borderRadius: 8, background: "#e0e0e0", color: "#111", cursor: "pointer" }}
          >
            Generate Output (inline HTML)
          </button>
          <button
            onClick={copyOutput}
            aria-label="Copy generated HTML to clipboard"
            disabled={!outputHtml}
            style={{ padding: "8px 12px", border: "1px solid #999", borderRadius: 8, background: "#e0e0e0", color: "#111", cursor: "pointer" }}
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
