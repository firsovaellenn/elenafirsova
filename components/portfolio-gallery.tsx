"use client";

import { useState, useCallback, useEffect } from "react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Upload,
  Trash2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, portfolioItems, PortfolioItem } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/scroll-reveal";

type CategoryId = (typeof categories)[number]["id"];
type PhotoItem = PortfolioItem & { isUploaded?: boolean };
type UploadCategory = "fashion" | "beauty" | "commercial";

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

const STORAGE_KEY = "uploaded-photos";
const PHOTO_PREFIX = "upload-";

function loadUploadedPhotos(): PhotoItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as PhotoItem[];
  } catch {
    return [];
  }
}

function saveUploadedPhotos(photos: PhotoItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (e) {
    console.error("Failed to save photos to localStorage", e);
  }
}

export function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [selectedItem, setSelectedItem] = useState<PhotoItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [allItems, setAllItems] = useState<PhotoItem[]>(() => [
    ...portfolioItems,
    ...loadUploadedPhotos(),
  ]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] =
    useState<UploadCategory>("fashion");
  const [uploadTitle, setUploadTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  const filtered =
    activeCategory === "all"
      ? allItems
      : allItems.filter((item) => item.category === activeCategory);

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

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!VALID_TYPES.includes(file.type)) {
      toast.error("Можно загружать только JPEG, PNG или WebP");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Файл слишком большой. Максимум 5MB");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    if (!uploadTitle) {
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ""));
    }
  }

  async function handleUpload() {
    if (!selectedFile) {
      toast.error("Выберите файл");
      return;
    }

    if (!uploadTitle.trim()) {
      toast.error("Введите название фото");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Загружаем фото...");

    try {
      const base64 = await readFileAsBase64(selectedFile);

      const newItem: PhotoItem = {
        id: `${PHOTO_PREFIX}${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        src: base64,
        alt: uploadTitle.trim(),
        category: uploadCategory,
        title: uploadTitle.trim(),
        width: 800,
        height: 1000,
        isUploaded: true,
      };

      const updated = [newItem, ...allItems];
      setAllItems(updated);
      saveUploadedPhotos(updated.filter((i) => i.id.startsWith(PHOTO_PREFIX)));
      setUploadOpen(false);
      resetUploadForm();
      toast.success("Фото загружено", { id: toastId });
    } catch {
      toast.error("Не удалось загрузить фото", { id: toastId });
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: PhotoItem) {
    if (!confirm("Удалить это фото?")) return;

    const toastId = toast.loading("Удаляем...");

    try {
      const updated = allItems.filter((p) => p.id !== item.id);
      setAllItems(updated);
      saveUploadedPhotos(updated.filter((i) => i.id.startsWith(PHOTO_PREFIX)));
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
      toast.success("Фото удалено", { id: toastId });
    } catch {
      toast.error("Не удалось удалить фото", { id: toastId });
    }
  }

  function resetUploadForm() {
    setSelectedFile(null);
    setUploadCategory("fashion");
    setUploadTitle("");
    setPreviewUrl(null);
  }

  function isUploaded(item: PhotoItem) {
    return item.id.startsWith(PHOTO_PREFIX);
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

        <ScrollReveal delay={100}>
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300",
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {cat.label}
              </button>
            ))}
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, index) => (
              <ScrollReveal key={item.id} delay={index * 60}>
                <div className="group relative">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className={cn(
                      "relative overflow-hidden rounded-3xl bg-muted text-left w-full",
                      "shadow-sm hover:shadow-xl transition-all duration-500"
                    )}
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
                          loadedImages.has(item.id)
                            ? "opacity-0"
                            : "opacity-100"
                        )}
                      />
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        onLoad={() => handleImageLoad(item.id)}
                        className={cn(
                          "h-full w-full object-cover transition-all duration-700",
                          "group-hover:scale-110 group-hover:opacity-90",
                          loadedImages.has(item.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white text-lg font-bold">
                        {item.title}
                      </p>
                      <p className="text-white/70 text-sm uppercase tracking-wider">
                        {item.category}
                      </p>
                    </div>
                  </button>
                  {isUploaded(item) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item);
                      }}
                      className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500/70 transition-all duration-200 backdrop-blur-sm"
                      aria-label="Удалить фото"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        {loaded && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-lg">
              Нет работ в этой категории
            </p>
          </div>
        )}
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <button
            onClick={() => setSelectedItem(null)}
            className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
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
            className="absolute left-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
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
            className="absolute right-6 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-sm"
            aria-label="Следующее"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-[90vw] animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.src}
              alt={selectedItem.alt}
              className="max-h-[90vh] max-w-[90vw] h-auto w-auto rounded-2xl object-contain shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl">
              <p className="text-white text-xl font-bold">
                {selectedItem.title}
              </p>
              <p className="text-white/70 text-sm uppercase tracking-wider">
                {selectedItem.category}
              </p>
            </div>
          </div>
        </div>
      )}

      {uploadOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => !uploading && setUploadOpen(false)}
        >
          <div
            className="bg-background rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
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

            <div className="space-y-2">
              <div>
                <label className="block text-xs font-bold mb-1 uppercase tracking-wider">
                  Фото <span className="text-destructive">*</span>
                </label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-xl p-3 cursor-pointer hover:border-primary/50 transition-colors">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-16 rounded-lg object-contain mb-2"
                    />
                  ) : (
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                  )}
                  <span className="text-xs text-muted-foreground">
                    {previewUrl
                      ? "Нажмите чтобы изменить"
                      : "Нажмите чтобы выбрать фото"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-1">
                  JPEG, PNG или WebP. Максимум 5 МБ.
                </p>
              </div>

              <div>
                <label
                  htmlFor="upload-title"
                  className="block text-xs font-bold mb-1 uppercase tracking-wider"
                >
                  Название <span className="text-destructive">*</span>
                </label>
                <input
                  id="upload-title"
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Например: Editorial Spring"
                  className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs ring-offset-background file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={uploading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Дайте фото короткое описательное название.
                </p>
              </div>

              <div>
                <label
                  htmlFor="upload-category"
                  className="block text-xs font-bold mb-1 uppercase tracking-wider"
                >
                  Категория <span className="text-destructive">*</span>
                </label>
                <select
                  id="upload-category"
                  value={uploadCategory}
                  onChange={(e) =>
                    setUploadCategory(e.target.value as UploadCategory)
                  }
                  className="flex h-9 w-full rounded-xl border border-input bg-background px-3 py-1 text-xs ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={uploading}
                >
                  <option value="fashion">Fashion</option>
                  <option value="beauty">Beauty</option>
                  <option value="commercial">Commercial</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Выберите категорию для фото — fashion, beauty или commercial.
                </p>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  className="flex-1 rounded-xl h-9 text-xs"
                  onClick={() => setUploadOpen(false)}
                  disabled={uploading}
                >
                  Отмена
                </Button>
                <Button
                  className="flex-1 gap-1 rounded-xl h-9 text-xs"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading && <Loader2 className="h-3 w-3 animate-spin" />}
                  {uploading ? "Загрузка..." : "Загрузить"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
