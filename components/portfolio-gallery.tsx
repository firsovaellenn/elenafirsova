"use client";

import { useState } from "react";
import { Lock, ExternalLink, Upload, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PinDialog } from "@/components/pin-dialog";
import { TextEditorDialog } from "@/components/text-editor-dialog";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useManagement } from "@/components/management-context";
import { Button } from "@/components/ui/button";
import { repoPhotos } from "@/lib/portfolio-photos";

export function PortfolioGallery() {
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [textEditorOpen, setTextEditorOpen] = useState(false);
  const { isManagement, onPinSuccess } = useManagement();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function handlePinSuccess() {
    onPinSuccess();
    setPinDialogOpen(false);
  }

  function handleTextEditorSave() {
    window.location.reload();
  }

  const allPhotos = repoPhotos;

  function openLightbox(index: number) {
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function prevPhoto() {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + allPhotos.length) % allPhotos.length);
    }
  }

  function nextPhoto() {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % allPhotos.length);
    }
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
                <a
                  href="https://github.com/firsovaellenn/elenafirsova/tree/main/public/photos"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="gap-2 rounded-full px-6 font-semibold">
                    <Upload className="h-4 w-4" />
                    Загрузить фото
                  </Button>
                </a>
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

        {allPhotos.length > 0 ? (
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {allPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => openLightbox(index)}
                  className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-muted"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </button>
              ))}
            </div>
          </ScrollReveal>
        ) : (
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
        )}
      </div>

      {/* Лайтбокс */}
      {lightboxIndex !== null && allPhotos[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white z-10"
          >
            <X className="h-8 w-8" />
          </button>

          {allPhotos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white z-10"
              >
                <ChevronLeft className="h-10 w-10" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white z-10"
              >
                <ChevronRight className="h-10 w-10" />
              </button>
            </>
          )}

          <img
            src={allPhotos[lightboxIndex].src}
            alt={allPhotos[lightboxIndex].alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

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
