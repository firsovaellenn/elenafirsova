"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { loadTheme, applyTheme, themes, type Theme } from "@/lib/themes";

interface ThemeContextValue {
  currentThemeId: string;
  currentTheme: Theme;
  setTheme: (id: string) => void;
  themeDialogOpen: boolean;
  openThemeDialog: () => void;
  closeThemeDialog: () => void;
}

const ThemeCtx = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentThemeId, setCurrentThemeId] = useState<string>(() => {
    if (typeof window === "undefined") return "coral";
    return loadTheme();
  });
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);

  useEffect(() => {
    applyTheme(currentThemeId);
  }, [currentThemeId]);

  const setTheme = useCallback((id: string) => {
    setCurrentThemeId(id);
  }, []);

  const currentTheme = themes.find((t) => t.id === currentThemeId) ?? themes[0];

  return (
    <ThemeCtx.Provider
      value={{
        currentThemeId,
        currentTheme,
        setTheme,
        themeDialogOpen,
        openThemeDialog: () => setThemeDialogOpen(true),
        closeThemeDialog: () => setThemeDialogOpen(false),
      }}
    >
      {children}
    </ThemeCtx.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeCtx);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
