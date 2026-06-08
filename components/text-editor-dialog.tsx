"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { loadSiteText, saveSiteText, type SiteText } from "@/lib/site-text";

interface TextEditorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function TextEditorDialog({
  open,
  onOpenChange,
  onSave,
}: TextEditorDialogProps) {
  const [text, setText] = useState<SiteText | null>(null);

  useEffect(() => {
    if (open) {
      setText(loadSiteText());
    } else {
      setText(null);
    }
  }, [open]);

  function update<K extends keyof SiteText>(key: K, value: SiteText[K]) {
    setText((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function handleSave() {
    if (!text) return;
    saveSiteText(text);
    toast.success("Текст сохранён");
    onSave();
    onOpenChange(false);
  }

  if (!open || !text) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto py-8"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-background rounded-2xl shadow-2xl w-full max-w-3xl mx-4 p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-black tracking-tight">
            Редактировать текст
          </h3>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-8 max-h-[70vh] overflow-y-auto pr-2">
          {/* Шапка сайта */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider">Шапка сайта</h4>
            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <input
                value={text.hero.subtitle}
                onChange={(e) =>
                  update("hero", { ...text.hero, subtitle: e.target.value })
                }
                placeholder="Подзаголовок (напр. Professional Model)"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <div className="flex gap-2">
                <input
                  value={text.hero.name}
                  onChange={(e) =>
                    update("hero", { ...text.hero, name: e.target.value })
                  }
                  placeholder="Имя"
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <input
                  value={text.hero.surname}
                  onChange={(e) =>
                    update("hero", { ...text.hero, surname: e.target.value })
                  }
                  placeholder="Фамилия"
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <input
                value={text.hero.tags}
                onChange={(e) =>
                  update("hero", { ...text.hero, tags: e.target.value })
                }
                placeholder="Теги (напр. Fashion · Beauty · Commercial)"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <textarea
                value={text.hero.description}
                onChange={(e) =>
                  update("hero", { ...text.hero, description: e.target.value })
                }
                rows={3}
                placeholder="Описание под шапкой"
                className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider">Био</h4>
            <textarea
              value={text.bio}
              onChange={(e) => update("bio", e.target.value)}
              rows={4}
              className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider">Опыт работы</h4>
              <button
                onClick={() =>
                  update("experience", [
                    ...text.experience,
                    { period: "", description: "" },
                  ])
                }
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-3 w-3" />
                Добавить
              </button>
            </div>
            {text.experience.map((exp, i) => (
              <div key={i} className="flex gap-3 items-start bg-muted/30 rounded-xl p-4">
                <div className="flex-1 space-y-2">
                  <input
                    value={exp.period}
                    onChange={(e) => {
                      const next = [...text.experience];
                      next[i] = { ...next[i], period: e.target.value };
                      update("experience", next);
                    }}
                    placeholder="Период"
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <input
                    value={exp.description}
                    onChange={(e) => {
                      const next = [...text.experience];
                      next[i] = { ...next[i], description: e.target.value };
                      update("experience", next);
                    }}
                    placeholder="Описание"
                    className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <button
                  onClick={() => {
                    const next = text.experience.filter((_, idx) => idx !== i);
                    update("experience", next);
                  }}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold uppercase tracking-wider">Достижения</h4>
              <button
                onClick={() =>
                  update("achievements", [...text.achievements, ""])
                }
                className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-3 w-3" />
                Добавить
              </button>
            </div>
            {text.achievements.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <input
                  value={item}
                  onChange={(e) => {
                    const next = [...text.achievements];
                    next[i] = e.target.value;
                    update("achievements", next);
                  }}
                  placeholder="Достижение"
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <button
                  onClick={() => {
                    const next = text.achievements.filter((_, idx) => idx !== i);
                    update("achievements", next);
                  }}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider">Услуги и цены</h4>
            {text.services.map((service, i) => (
              <div key={service.id} className="space-y-2 bg-muted/30 rounded-xl p-4">
                <input
                  value={service.title}
                  onChange={(e) => {
                    const next = [...text.services];
                    next[i] = { ...next[i], title: e.target.value };
                    update("services", next);
                  }}
                  placeholder="Название услуги"
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
                <textarea
                  value={service.description}
                  onChange={(e) => {
                    const next = [...text.services];
                    next[i] = { ...next[i], description: e.target.value };
                    update("services", next);
                  }}
                  rows={2}
                  placeholder="Описание"
                  className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                />
                <input
                  value={service.priceFrom}
                  onChange={(e) => {
                    const next = [...text.services];
                    next[i] = { ...next[i], priceFrom: e.target.value };
                    update("services", next);
                  }}
                  placeholder="Цена"
                  className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider">Контакты</h4>
            <div className="space-y-2 bg-muted/30 rounded-xl p-4">
              <input
                value={text.contacts.email}
                onChange={(e) =>
                  update("contacts", { ...text.contacts, email: e.target.value })
                }
                placeholder="Email"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <input
                value={text.contacts.businessEmail}
                onChange={(e) =>
                  update("contacts", { ...text.contacts, businessEmail: e.target.value })
                }
                placeholder="Business Email"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <input
                value={text.contacts.phone}
                onChange={(e) =>
                  update("contacts", { ...text.contacts, phone: e.target.value })
                }
                placeholder="Телефон"
                className="flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8 pt-4 border-t border-border/40">
          <Button
            variant="outline"
            className="flex-1 rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Отмена
          </Button>
          <Button className="flex-1 rounded-xl gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" />
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
}
