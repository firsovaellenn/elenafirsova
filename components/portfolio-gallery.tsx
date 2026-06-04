"use client";

import { useState, useCallback, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { portfolioItems, categories, PortfolioItem } from "@/lib/data";

type CategoryId = (typeof categories)[number]["id"];

export function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const filtered =
    activeCategory === "all"
      ? portfolioItems
      : portfolioItems.filter((item) => item.category === activeCategory);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === "Escape") {
        setSelectedItem(null);
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const currentIndex = filtered.findIndex(
          (item) => item.id === selectedItem.id
        );
        if (currentIndex === -1) return;
        const nextIndex =
          e.key === "ArrowLeft"
            ? (currentIndex - 1 + filtered.length) % filtered.length
            : (currentIndex + 1) % filtered.length;
        setSelectedItem(filtered[nextIndex]);
      }
    },
    [selectedItem, filtered]
  );

  useEffect(() => {
    if (!selectedItem) return;
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedItem, handleKeyDown]);

  function handleImageLoad(id: string) {
    setLoadedImages((prev) => new Set(prev).add(id));
  }

  return (
    <section id="portfolio" className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Portfolio
          </p>
          <h2 className="text-4xl font-light tracking-tight sm:text-5xl">
            Мои работы
          </h2>
          <div className="mx-auto h-px w-16 bg-muted-foreground/30" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-5 py-2 rounded-full text-sm font-medium transition-all duration-300",
                activeCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className={cn(
                "group relative overflow-hidden rounded-xl bg-muted text-left",
                "animate-in fade-in slide-in-from-bottom-4 duration-500"
              )}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div
                className="relative w-full"
                style={{
                  aspectRatio: `${item.width} / ${item.height}`,
                }}
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-muted transition-opacity duration-500",
                    loadedImages.has(item.id) ? "opacity-0" : "opacity-100"
                  )}
                />
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  onLoad={() => handleImageLoad(item.id)}
                  className={cn(
                    "h-full w-full object-cover transition-all duration-500",
                    "group-hover:scale-105 group-hover:opacity-90",
                    loadedImages.has(item.id) ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-white text-sm font-medium">{item.title}</p>
                <p className="text-white/70 text-xs capitalize">
                  {item.category}
                </p>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Camera className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Нет работ в этой категории</p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const idx = filtered.findIndex((i) => i.id === selectedItem.id);
              const prev = (idx - 1 + filtered.length) % filtered.length;
              setSelectedItem(filtered[prev]);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Предыдущее"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              const idx = filtered.findIndex((i) => i.id === selectedItem.id);
              const next = (idx + 1) % filtered.length;
              setSelectedItem(filtered[next]);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            aria-label="Следующее"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw] animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.src}
              alt={selectedItem.alt}
              className="max-h-[90vh] max-w-[90vw] h-auto w-auto rounded-lg object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent rounded-b-lg">
              <p className="text-white text-lg font-medium">
                {selectedItem.title}
              </p>
              <p className="text-white/70 text-sm capitalize">
                {selectedItem.category}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
