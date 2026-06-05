"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { testimonialsData } from "@/lib/data";
import { ScrollReveal } from "@/components/scroll-reveal";

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = testimonialsData.length;

  const goTo = useCallback(
    (index: number) => {
      setCurrent((index + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(current + 1), [current, goTo]);
  const goPrev = useCallback(() => goTo(current - 1), [current, goTo]);

  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(goNext, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [goNext, isPaused]);

  const t = testimonialsData[current];

  return (
    <section id="testimonials" className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto max-w-7xl relative z-10">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-16">
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">
              Testimonials
            </p>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Отзывы и клиенты
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Что говорят фотографы, бренды и агентства о сотрудничестве
            </p>
            <div className="mx-auto h-1 w-16 bg-gradient-gold rounded-full" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <div
            className="max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative">
              <div className="bg-card border border-border/40 rounded-3xl p-10 sm:p-14 shadow-sm">
                <Quote className="h-10 w-10 text-primary/20 mb-8" />

                <blockquote className="text-xl sm:text-2xl text-foreground/90 leading-relaxed mb-10 font-light italic">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0 shadow-lg">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="font-bold text-base">{t.name}</p>
                    <p className="text-sm text-muted-foreground tracking-wide">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex h-12 w-12 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all shadow-sm"
                aria-label="Предыдущий отзыв"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                onClick={goNext}
                className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 hidden sm:flex h-12 w-12 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all shadow-sm"
                aria-label="Следующий отзыв"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-3 mt-10">
              {testimonialsData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goTo(index)}
                  className={`rounded-full transition-all duration-500 ${
                    index === current
                      ? "w-10 h-3 bg-primary"
                      : "w-3 h-3 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                  aria-label={`Отзыв ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
