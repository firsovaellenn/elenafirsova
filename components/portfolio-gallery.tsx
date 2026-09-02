"use client";

import { useState } from "react";
import { ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PinDialog } from "@/components/pin-dialog";
import { useManagement } from "@/components/management-context";
import { repoPhotos } from "@/lib/portfolio-photos";

export function PortfolioGallery() {
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const { isManagement, onPinSuccess } = useManagement();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  function handlePinSuccess() {
    onPinSuccess();
    setPinDialogOpen(false);
  }

  function openLightbox(index: number) {
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function prevPhoto() {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + repoPhotos.length) % repoPhotos.length);
    }
  }

  function nextPhoto() {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % repoPhotos.length);
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
  Портфолио
</h2>
            <div className="mx-auto h-1 w-16 bg-gradient-gold rounded-full" />
          </div>
        </ScrollReveal>

        {repoPhotos.length > 0 ? (
          <ScrollReveal delay={200}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {repoPhotos.map((photo, index) => (
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

      {lightboxIndex !== null && repoPhotos[lightboxIndex] && (
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

          {repoPhotos.length > 1 && (
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
            src={repoPhotos[lightboxIndex].src}
            alt={repoPhotos[lightboxIndex].alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <PinDialog
        open={pinDialogOpen}
        onOpenChange={setPinDialogOpen}
        onSuccess={handlePinSuccess}
      />
    </section>
  );
}
