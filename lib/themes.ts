"use client";

export interface Theme {
  id: string;
  name: string;
  variables: Record<string, string>;
}

const STORAGE_KEY = "selected-theme";

export function loadTheme(): string {
  if (typeof window === "undefined") return "coral";
  try {
    return localStorage.getItem(STORAGE_KEY) || "coral";
  } catch {
    return "coral";
  }
}

export function saveTheme(themeId: string) {
  try {
    localStorage.setItem(STORAGE_KEY, themeId);
  } catch {
    /* noop */
  }
}

export function applyTheme(themeId: string) {
  const theme = themes.find((t) => t.id === themeId);
  if (!theme) return;
  const root = document.documentElement;
  Object.entries(theme.variables).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
  saveTheme(themeId);
}

export const themes: Theme[] = [
  {
    id: "coral",
    name: "Коралловый",
    variables: {
      "--background": "oklch(0.99 0.005 85)",
      "--foreground": "oklch(0.12 0.015 270)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.12 0.015 270)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.12 0.015 270)",
      "--primary": "oklch(0.55 0.22 10)",
      "--primary-foreground": "oklch(0.98 0.005 85)",
      "--secondary": "oklch(0.7 0.12 60)",
      "--secondary-foreground": "oklch(0.15 0.03 270)",
      "--muted": "oklch(0.95 0.01 85)",
      "--muted-foreground": "oklch(0.5 0.04 270)",
      "--accent": "oklch(0.85 0.08 60)",
      "--accent-foreground": "oklch(0.2 0.03 270)",
      "--destructive": "oklch(0.55 0.22 25)",
      "--border": "oklch(0.88 0.02 85)",
      "--input": "oklch(0.88 0.02 85)",
      "--ring": "oklch(0.55 0.22 10)",
    },
  },
  {
    id: "rose",
    name: "Розовый",
    variables: {
      "--background": "oklch(0.99 0.005 10)",
      "--foreground": "oklch(0.12 0.02 340)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.12 0.02 340)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.12 0.02 340)",
      "--primary": "oklch(0.5 0.25 350)",
      "--primary-foreground": "oklch(0.98 0.005 10)",
      "--secondary": "oklch(0.65 0.15 20)",
      "--secondary-foreground": "oklch(0.15 0.03 340)",
      "--muted": "oklch(0.95 0.015 10)",
      "--muted-foreground": "oklch(0.5 0.05 340)",
      "--accent": "oklch(0.82 0.1 20)",
      "--accent-foreground": "oklch(0.2 0.03 340)",
      "--destructive": "oklch(0.55 0.22 25)",
      "--border": "oklch(0.88 0.03 10)",
      "--input": "oklch(0.88 0.03 10)",
      "--ring": "oklch(0.5 0.25 350)",
    },
  },
  {
    id: "sapphire",
    name: "Сапфировый",
    variables: {
      "--background": "oklch(0.98 0.008 260)",
      "--foreground": "oklch(0.12 0.02 260)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.12 0.02 260)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.12 0.02 260)",
      "--primary": "oklch(0.45 0.22 260)",
      "--primary-foreground": "oklch(0.98 0.005 260)",
      "--secondary": "oklch(0.65 0.12 220)",
      "--secondary-foreground": "oklch(0.15 0.03 260)",
      "--muted": "oklch(0.94 0.015 260)",
      "--muted-foreground": "oklch(0.5 0.05 260)",
      "--accent": "oklch(0.82 0.08 220)",
      "--accent-foreground": "oklch(0.2 0.03 260)",
      "--destructive": "oklch(0.55 0.22 25)",
      "--border": "oklch(0.86 0.025 260)",
      "--input": "oklch(0.86 0.025 260)",
      "--ring": "oklch(0.45 0.22 260)",
    },
  },
  {
    id: "emerald",
    name: "Изумрудный",
    variables: {
      "--background": "oklch(0.98 0.008 150)",
      "--foreground": "oklch(0.12 0.02 160)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.12 0.02 160)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.12 0.02 160)",
      "--primary": "oklch(0.45 0.2 160)",
      "--primary-foreground": "oklch(0.98 0.005 150)",
      "--secondary": "oklch(0.65 0.12 140)",
      "--secondary-foreground": "oklch(0.15 0.03 160)",
      "--muted": "oklch(0.94 0.015 150)",
      "--muted-foreground": "oklch(0.5 0.04 160)",
      "--accent": "oklch(0.82 0.08 140)",
      "--accent-foreground": "oklch(0.2 0.03 160)",
      "--destructive": "oklch(0.55 0.22 25)",
      "--border": "oklch(0.86 0.025 150)",
      "--input": "oklch(0.86 0.025 150)",
      "--ring": "oklch(0.45 0.2 160)",
    },
  },
  {
    id: "amethyst",
    name: "Аметистовый",
    variables: {
      "--background": "oklch(0.98 0.01 290)",
      "--foreground": "oklch(0.12 0.025 290)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.12 0.025 290)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.12 0.025 290)",
      "--primary": "oklch(0.48 0.22 290)",
      "--primary-foreground": "oklch(0.98 0.005 290)",
      "--secondary": "oklch(0.65 0.14 310)",
      "--secondary-foreground": "oklch(0.15 0.03 290)",
      "--muted": "oklch(0.93 0.02 290)",
      "--muted-foreground": "oklch(0.5 0.06 290)",
      "--accent": "oklch(0.8 0.1 310)",
      "--accent-foreground": "oklch(0.2 0.03 290)",
      "--destructive": "oklch(0.55 0.22 25)",
      "--border": "oklch(0.85 0.03 290)",
      "--input": "oklch(0.85 0.03 290)",
      "--ring": "oklch(0.48 0.22 290)",
    },
  },
  {
    id: "sunset",
    name: "Закатный",
    variables: {
      "--background": "oklch(0.98 0.01 60)",
      "--foreground": "oklch(0.12 0.025 40)",
      "--card": "oklch(1 0 0)",
      "--card-foreground": "oklch(0.12 0.025 40)",
      "--popover": "oklch(1 0 0)",
      "--popover-foreground": "oklch(0.12 0.025 40)",
      "--primary": "oklch(0.55 0.22 40)",
      "--primary-foreground": "oklch(0.98 0.005 60)",
      "--secondary": "oklch(0.7 0.15 30)",
      "--secondary-foreground": "oklch(0.15 0.03 40)",
      "--muted": "oklch(0.93 0.02 60)",
      "--muted-foreground": "oklch(0.5 0.06 40)",
      "--accent": "oklch(0.83 0.1 30)",
      "--accent-foreground": "oklch(0.2 0.03 40)",
      "--destructive": "oklch(0.55 0.22 25)",
      "--border": "oklch(0.85 0.03 60)",
      "--input": "oklch(0.85 0.03 60)",
      "--ring": "oklch(0.55 0.22 40)",
    },
  },
  {
    id: "champagne",
    name: "Шампань",
    variables: {
      "--background": "oklch(0.97 0.015 70)",
      "--foreground": "oklch(0.15 0.02 60)",
      "--card": "oklch(0.99 0.008 70)",
      "--card-foreground": "oklch(0.15 0.02 60)",
      "--popover": "oklch(0.99 0.008 70)",
      "--popover-foreground": "oklch(0.15 0.02 60)",
      "--primary": "oklch(0.55 0.18 50)",
      "--primary-foreground": "oklch(0.98 0.005 70)",
      "--secondary": "oklch(0.7 0.1 55)",
      "--secondary-foreground": "oklch(0.15 0.02 60)",
      "--muted": "oklch(0.94 0.015 70)",
      "--muted-foreground": "oklch(0.52 0.04 60)",
      "--accent": "oklch(0.85 0.06 55)",
      "--accent-foreground": "oklch(0.2 0.02 60)",
      "--destructive": "oklch(0.55 0.22 25)",
      "--border": "oklch(0.86 0.025 70)",
      "--input": "oklch(0.86 0.025 70)",
      "--ring": "oklch(0.55 0.18 50)",
    },
  },
  {
    id: "midnight",
    name: "Полуночный",
    variables: {
      "--background": "oklch(0.14 0.02 270)",
      "--foreground": "oklch(0.93 0.015 85)",
      "--card": "oklch(0.18 0.025 270)",
      "--card-foreground": "oklch(0.93 0.015 85)",
      "--popover": "oklch(0.18 0.025 270)",
      "--popover-foreground": "oklch(0.93 0.015 85)",
      "--primary": "oklch(0.6 0.22 10)",
      "--primary-foreground": "oklch(0.14 0.02 270)",
      "--secondary": "oklch(0.35 0.08 60)",
      "--secondary-foreground": "oklch(0.88 0.015 85)",
      "--muted": "oklch(0.22 0.025 270)",
      "--muted-foreground": "oklch(0.62 0.04 270)",
      "--accent": "oklch(0.3 0.08 60)",
      "--accent-foreground": "oklch(0.88 0.015 85)",
      "--destructive": "oklch(0.6 0.22 25)",
      "--border": "oklch(1 0 0 / 14%)",
      "--input": "oklch(1 0 0 / 18%)",
      "--ring": "oklch(0.6 0.22 10)",
    },
  },
];
