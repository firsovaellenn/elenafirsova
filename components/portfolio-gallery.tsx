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

export function PortfolioGallery() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("all");
  const [selectedItem, setSelectedItem] = useState<PhotoItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [allItems, setAllItems] = useState<PhotoItem[]>(portfolioItems);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] =
    useState<UploadCategory>("fashion");
  const [uploadTitle, setUploadTitle] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);
  const [loadedUploaded, setLoadedUploaded] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("/api/photos");
        if (res.ok) {
          const data = await res.json();
          if (data.photos) {
            const uploadedIds = new Set(
              (data.photos as PhotoItem[])
                .filter((p: PhotoItem) => p.id.startsWith("upload-"))
                .map((p: PhotoItem) => p.id)
            );
            setLoadedUploaded(uploadedIds);
            setAllItems(data.photos);
          }
        }
      } catch {
      } finally {
        setFetching(false);
      }
    }
    fetchPhotos();
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

      const res = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          src: base64,
          alt: uploadTitle.trim(),
          category: uploadCategory,
          title: uploadTitle.trim(),
          width: 800,
          height: 1000,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Ошибка загрузки");
      }

      const data = await res.json();
      const newItem: PhotoItem = {
        ...data.photo,
        isUploaded: true,
      };

      setAllItems((prev) => [newItem, ...prev]);
      setLoadedUploaded((prev) => new Set(prev).add(newItem.id));
      setUploadOpen(false);
      resetUploadForm();
      toast.success("Фото загружено", { id: toastId });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Не удалось загрузить фото",
        { id: toastId }
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(item: PhotoItem) {
    if (!confirm("Удалить это фото?")) return;

    const toastId = toast.loading("Удаляем...");

    try {
      const res = await fetch(`/api/photos?id=${item.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Ошибка удаления");
      }

      setAllItems((prev) => prev.filter((p) => p.id !== item.id));
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
    return item.id.startsWith("upload-") || loadedUploaded.has(item.id);
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

        <div className="flex flex-wrap justify-center gap-2 mb-8">
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

        <div className="flex justify-center mb-10">
          <Button
            onClick={() => setUploadOpen(true)}
            className="gap-2"
            variant="outline"
          >
            <Upload className="h-4 w-4" />
            Загрузить фото
          </Button>
        </div>

        {fetching ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, index) => (
              <div key={item.id} className="group relative">
                <button
                  onClick={() => setSelectedItem(item)}
                  className={cn(
                    "relative overflow-hidden rounded-xl bg-muted text-left w-full",
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
                    <p className="text-white text-sm font-medium">
                      {item.title}
                    </p>
                    <p className="text-white/70 text-xs capitalize">
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
                    className="absolute top-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 hover:bg-red-500/70 transition-all duration-200"
                    aria-label="Удалить фото"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {!fetching && filtered.length === 0 && (
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

      {uploadOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => !uploading && setUploadOpen(false)}
        >
          <div
            className="bg-background rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Загрузить фото</h3>
              <button
                onClick={() => setUploadOpen(false)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
                disabled={uploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Файл</label>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-xl p-6 cursor-pointer hover:border-primary/50 transition-colors">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-40 rounded-lg object-contain mb-2"
                    />
                  ) : (
                    <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  )}
                  <span className="text-sm text-muted-foreground">
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
              </div>

              <div>
                <label
                  htmlFor="upload-title"
                  className="block text-sm font-medium mb-1.5"
                >
                  Название
                </label>
                <input
                  id="upload-title"
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="Например: Editorial Spring"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={uploading}
                />
              </div>

              <div>
                <label
                  htmlFor="upload-category"
                  className="block text-sm font-medium mb-1.5"
                >
                  Категория
                </label>
                <select
                  id="upload-category"
                  value={uploadCategory}
                  onChange={(e) =>
                    setUploadCategory(e.target.value as UploadCategory)
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={uploading}
                >
                  <option value="fashion">Fashion</option>
                  <option value="beauty">Beauty</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setUploadOpen(false)}
                  disabled={uploading}
                >
                  Отмена
                </Button>
                <Button
                  className="flex-1 gap-2"
                  onClick={handleUpload}
                  disabled={uploading || !selectedFile}
                >
                  {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
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
