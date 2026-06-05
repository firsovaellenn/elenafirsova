"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Trash2,
  Loader2,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const VALID_TYPES = ["image/jpeg", "image/png", "image/webp"];

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function generateId(): string {
  return `photo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const STORAGE_KEY = "gallery-photos";

function loadPhotos(): GalleryPhoto[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GalleryPhoto[];
  } catch {
    return [];
  }
}

function savePhotos(photos: GalleryPhoto[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch {
    console.error("Failed to save photos to localStorage");
  }
}

function SortablePhoto({
  photo,
  onSelect,
  onDelete,
}: {
  photo: GalleryPhoto;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <button
        onClick={onSelect}
        className={cn(
          "relative overflow-hidden rounded-3xl bg-muted text-left w-full",
          "shadow-sm hover:shadow-xl transition-all duration-500"
        )}
      >
        <div
          className="relative w-full"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        >
          <img
            src={photo.src}
            alt={photo.alt}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
          />
        </div>
      </button>

      <button
        {...attributes}
        {...listeners}
        className="absolute top-3 left-3 z-10 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 hover:bg-black/60 transition-all duration-200 cursor-grab active:cursor-grabbing"
        aria-label="Перетащить"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500/70 transition-all duration-200 backdrop-blur-sm"
        aria-label="Удалить фото"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function PortfolioGallery() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhotos(loadPhotos());
    setLoaded(true);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setPhotos((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const reordered = arrayMove(items, oldIndex, newIndex);
      savePhotos(reordered);
      return reordered;
    });
  }

  async function handleFiles(files: FileList) {
    const validFiles: File[] = [];

    for (const file of Array.from(files)) {
      if (!VALID_TYPES.includes(file.type)) {
        toast.error(`${file.name}: только JPEG, PNG или WebP`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name}: файл слишком большой (максимум 5MB)`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploading(true);
    const toastId = toast.loading(`Загружаем ${validFiles.length} фото...`);

    try {
      const newPhotos: GalleryPhoto[] = await Promise.all(
        validFiles.map(async (file) => ({
          id: generateId(),
          src: await readFileAsBase64(file),
          alt: file.name,
          width: 800,
          height: 1000,
        }))
      );

      setPhotos((prev) => {
        const updated = [...newPhotos, ...prev];
        savePhotos(updated);
        return updated;
      });

      setUploadOpen(false);
      toast.success(`Загружено ${validFiles.length} фото`, {
        id: toastId,
      });
    } catch {
      toast.error("Не удалось загрузить фото", { id: toastId });
    } finally {
      setUploading(false);
    }
  }

  function handleDelete(photo: GalleryPhoto) {
    if (!confirm("Удалить это фото?")) return;

    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== photo.id);
      savePhotos(updated);
      return updated;
    });

    if (selectedPhoto?.id === photo.id) {
      setSelectedPhoto(null);
    }

    toast.success("Фото удалено");
  }

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!selectedPhoto) return;

      if (e.key === "Escape") {
        setSelectedPhoto(null);
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const idx = photos.findIndex((p) => p.id === selectedPhoto.id);
        if (idx === -1) return;

        const next =
          e.key === "ArrowLeft"
            ? (idx - 1 + photos.length) % photos.length
            : (idx + 1) % photos.length;

        setSelectedPhoto(photos[next]);
      }
    },
    [selectedPhoto, photos]
  );

  useEffect(() => {
    if (!selectedPhoto) return;

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedPhoto, handleKeyDown]);

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
          <div className="flex justify-center mb-12">
            <Button
              onClick={() => setUploadOpen(true)}
              className="gap-2 rounded-full px-6 font-semibold"
              variant="outline"
            >
              <Upload className="h-4 w-4" />
              Загрузить фото
            </Button>
          </div>
        </ScrollReveal>

        {!loaded ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : photos.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={photos.map((p) => p.id)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {photos.map((photo) => (
                  <ScrollReveal key={photo.id} delay={0}>
                    <SortablePhoto
                      photo={photo}
                      onSelect={() => setSelectedPhoto(photo)}
                      onDelete={() => handleDelete(photo)}
                    />
                  </ScrollReveal>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg mb-4">
              Нет загруженных фото
            </p>
            <Button
              onClick={() => setUploadOpen(true)}
              variant="outline"
              className="gap-2 rounded-full"
            >
              <Upload className="h-4 w-4" />
              Загрузить первые фото
            </Button>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
            aria-label="Закрыть"
          >
            <X className="h-6 w-6" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = photos.findIndex(
                    (p) => p.id === selectedPhoto.id
                  );
                  const prev = (idx - 1 + photos.length) % photos.length;
                  setSelectedPhoto(photos[prev]);
                }}
                className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                aria-label="Предыдущее"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const idx = photos.findIndex(
                    (p) => p.id === selectedPhoto.id
                  );
                  const next = (idx + 1) % photos.length;
                  setSelectedPhoto(photos[next]);
                }}
                className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
                aria-label="Следующее"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative max-h-[90vh] max-w-[90vw] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="max-h-[90vh] max-w-[90vw] h-auto w-auto rounded-2xl object-contain shadow-2xl"
            />
          </div>
        </div>
      )}

      {uploadOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => !uploading && setUploadOpen(false)}
        >
          <div
            className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black tracking-tight">
                Загрузить фото
              </h3>
              <button
                onClick={() => setUploadOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 cursor-pointer hover:border-primary/50 transition-colors">
                {uploading ? (
                  <Loader2 className="h-10 w-10 animate-spin text-muted-foreground mb-3" />
                ) : (
                  <Upload className="h-10 w-10 text-muted-foreground mb-3" />
                )}
                <span className="text-sm font-medium text-muted-foreground">
                  {uploading ? "Загрузка..." : "Нажмите чтобы выбрать фото"}
                </span>
                {!uploading && (
                  <>
                    <span className="text-xs text-muted-foreground mt-1">
                      Можно выбрать несколько фото
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                      JPEG, PNG или WebP. Максимум 5 МБ.
                    </span>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={async (e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) {
                      await handleFiles(files);
                    }
                    e.target.value = "";
                  }}
                  className="hidden"
                  disabled={uploading}
                />
              </label>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl"
                  onClick={() => setUploadOpen(false)}
                  disabled={uploading}
                >
                  Отмена
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
