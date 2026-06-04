"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { testimonialsData } from "@/lib/data";

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
    <section id="testimonials" className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Testimonials
          </p>
          <h2 className="text-4xl font-light tracking-tight sm:text-5xl">
            Отзывы и клиенты
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Что говорят фотографы, бренды и агентства о сотрудничестве
          </p>
          <div className="mx-auto h-px w-16 bg-muted-foreground/30" />
        </div>

        <div
          className="max-w-3xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative">
            <div className="bg-muted/30 rounded-2xl p-8 sm:p-12 border border-border/40">
              <Quote className="h-8 w-8 text-primary/20 mb-6" />

              <blockquote className="text-lg sm:text-xl text-foreground/90 leading-relaxed mb-8 italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm shrink-0">
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </div>

            <button
              onClick={goPrev}
              className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Предыдущий отзыв"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={goNext}
              className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Следующий отзыв"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonialsData.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === current
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Отзыв ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
