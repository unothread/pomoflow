"use client";

import { useI18n } from "../lib/i18n";
import { useTheme, type Theme } from "../lib/theme";

export default function HeaderControls() {
  const { lang, setLang } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3">
      {/* Theme Switcher */}
      <div className="flex bg-card border border-card-border p-1" style={{ borderRadius: 'var(--radius-button)' }}>
        {(["garden", "space"] as Theme[]).map((t) => (
          <button
            key={t}
            onClick={() => setTheme(t)}
            className={`px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
              theme === t 
                ? "bg-foreground text-background" 
                : "text-muted hover:text-foreground"
            }`}
            style={{ borderRadius: 'calc(var(--radius-button) - 4px)' }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Language Switcher */}
      <div className="flex bg-card border border-card-border p-1" style={{ borderRadius: 'var(--radius-button)' }}>
        <button
          onClick={() => setLang("tr")}
          className={`px-2.5 py-1.5 text-xs font-bold transition-colors ${
            lang === "tr" ? "bg-foreground text-background" : "text-muted hover:text-foreground"
          }`}
          style={{ borderRadius: 'calc(var(--radius-button) - 4px)' }}
        >
          TR
        </button>
        <button
          onClick={() => setLang("en")}
          className={`px-2.5 py-1.5 text-xs font-bold transition-colors ${
            lang === "en" ? "bg-foreground text-background" : "text-muted hover:text-foreground"
          }`}
          style={{ borderRadius: 'calc(var(--radius-button) - 4px)' }}
        >
          EN
        </button>
      </div>
    </div>
  );
}