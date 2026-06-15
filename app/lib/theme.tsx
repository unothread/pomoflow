"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "garden" | "space";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useLocalStorage<Theme>("pomoflow.theme", "garden");

  // Migrate old 8bit theme to garden
  useEffect(() => {
    if (theme === "8bit" as string) {
      setTheme("garden");
    }
  }, [theme, setTheme]);

  // This effect runs whenever theme changes (even before mount if possible,
  // but definitely after hydration)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("theme-garden", "theme-space");
    root.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="contents">{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}