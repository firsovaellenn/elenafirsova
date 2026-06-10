"use client";

import { useState } from "react";
import { Lock, ExternalLink } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PinDialog } from "@/components/pin-dialog";
import { TextEditorDialog } from "@/components/text-editor-dialog";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useManagement } from "@/components/management-context";
import { Button } from "@/components/ui/button";

export function PortfolioGallery() {
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [textEditorOpen, setTextEditorOpen] = useState(false);
  const { isManagement, onPinSuccess } = useManagement();

  function handlePinSuccess() {
    onPinSuccess();
    setPinDialogOpen(false);
  }

  function handleTextEditorSave() {
    window.location.reload();
  }

  return (
    <section id="portfolio" className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />
      <div className="container mx-auto max-w-7xl relative z-10">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">
              Portfolio
            </p>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Мои работы
            </h2>
            <div className="mx-auto h-1 w-16 bg-gradient-gold rounded-full" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={150}>
          <div className="flex justify-center gap-3 mb-12">
            {isManagement ? (
              <>
                <Button
                  onClick={() => setTextEditorOpen(true)}
                  className="gap-2 rounded-full px-6 font-semibold"
                  variant="outline"
                >
                  Редактировать текст
                </Button>
                <ThemeSwitcher />
              </>
            ) : (
              <button
                onClick={() => setPinDialogOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors"
                aria-label="Панель управления"
              >
                <Lock className="h-3.5 w-3.5" />
                Управление
              </button>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div className="max-w-2xl mx-auto text-center">
            <a
              href="https://cloud.mail.ru/public/CxgU/6k4KYQjx2"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 bg-primary text-primary-foreground px-10 py-5 rounded-2xl text-xl font-bold shadow-lg hover:shadow-xl hover:opacity-90 transition-all duration-300"
            >
              <ExternalLink className="h-6 w-6 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              Ссылка на моё портфолио
            </a>
            <p className="text-muted-foreground text-sm mt-4">
              Нажмите чтобы открыть портфолио в облаке
            </p>
          </div>
        </ScrollReveal>
      </div>

      <TextEditorDialog
        key={String(textEditorOpen)}
        open={textEditorOpen}
        onOpenChange={setTextEditorOpen}
        onSave={handleTextEditorSave}
      />

      <PinDialog
        open={pinDialogOpen}
        onOpenChange={setPinDialogOpen}
        onSuccess={handlePinSuccess}
      />
    </section>
  );
}
