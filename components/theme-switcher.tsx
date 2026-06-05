"use client";

import { X, Palette } from "lucide-react";
import { themes } from "@/lib/themes";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";

export function ThemeSwitcher() {
  const {
    currentThemeId,
    setTheme,
    themeDialogOpen,
    openThemeDialog,
    closeThemeDialog,
  } = useTheme();

  if (!themeDialogOpen) {
    return (
      <Button
        onClick={openThemeDialog}
        variant="outline"
        className="gap-2 rounded-full px-6 font-semibold"
      >
        <Palette className="h-4 w-4" />
        Цветовые темы
      </Button>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeThemeDialog}
    >
      <div
        className="bg-background rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Palette className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-lg font-black tracking-tight">Цветовые темы</h3>
          </div>
          <button
            onClick={closeThemeDialog}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Выберите цветовую гамму для сайта. Тема сохраняется автоматически.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {themes.map((theme) => {
            const isActive = theme.id === currentThemeId;
            const primaryColor = theme.variables["--primary"] || "";
            const bgColor = theme.variables["--background"] || "";
            const accentColor = theme.variables["--accent"] || "";

            return (
              <button
                key={theme.id}
                onClick={() => {
                  setTheme(theme.id);
                }}
                className={`relative flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-300 ${
                  isActive
                    ? "border-primary shadow-lg shadow-primary/20 scale-105"
                    : "border-border/40 hover:border-foreground/30 hover:shadow-md"
                }`}
                style={{ background: bgColor }}
              >
                <div className="flex gap-1.5">
                  <div
                    className="h-6 w-6 rounded-full ring-2 ring-white/50"
                    style={{ background: primaryColor }}
                  />
                  <div
                    className="h-6 w-6 rounded-full ring-2 ring-white/50"
                    style={{ background: accentColor }}
                  />
                </div>
                <span
                  className="text-xs font-bold tracking-tight"
                  style={{ color: theme.variables["--foreground"] }}
                >
                  {theme.name}
                </span>
                {isActive && (
                  <div className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold shadow-lg">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={closeThemeDialog}
            className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-6 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
}
