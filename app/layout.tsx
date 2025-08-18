import type { Metadata } from "next";


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

  const mainStyle: React.CSSProperties = {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "16px",
  };

  return (
    <html lang="en">
      <body style={bodyStyle}>
        {/* Remember last visited page path on navigation */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var set = function(name, value, days){
                    var d = new Date();
                    d.setTime(d.getTime() + (days*24*60*60*1000));
                    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + d.toUTCString() + ';path=/';
                  };
                  set('lastMenu', location.pathname, 30);
                  var pushState = history.pushState;
                  history.pushState = function(){
                    pushState.apply(this, arguments);
                    set('lastMenu', location.pathname, 30);
                  };
                  window.addEventListener('popstate', function(){
                    set('lastMenu', location.pathname, 30);
                  });
                } catch(e){}
              })();
            `,
          }}
        />

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