import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { BridgeProvider } from "@/components/bridge-provider";
import { ManagementProvider } from "@/components/management-context";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const appName = "Елена Фирсова";

export const metadata: Metadata = {
  title: `${appName} — Professional Model`,
  description:
    "Портфолио профессиональной модели. Fashion, beauty, commercial съёмки.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={cn("font-sans", geist.variable)}>
      <body className="antialiased min-h-screen bg-background flex flex-col">
        <BridgeProvider />
        <ManagementProvider>
          <ThemeProvider>
            <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md">
              <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xl font-bold tracking-tight"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  {appName}
                </Link>
                <nav className="hidden sm:flex items-center gap-8">
                  {[
                    { href: "#about", label: "О себе" },
                    { href: "#services", label: "Услуги" },
                    { href: "#portfolio", label: "Портфолио" },
                    { href: "#testimonials", label: "Отзывы" },
                    { href: "#contacts", label: "Контакты" },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border/40">
              <div className="container mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold tracking-tight">
                    {appName}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  © {new Date().getFullYear()} {appName}. All rights reserved.
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </ManagementProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
