"use client";

import { useState } from "react";
import { Lock, PenLine, Upload, Palette } from "lucide-react";
import { PinDialog } from "@/components/pin-dialog";
import { TextEditorDialog } from "@/components/text-editor-dialog";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useManagement } from "@/components/management-context";

export function HeaderManagementButton() {
  const [open, setOpen] = useState(false);
  const [textEditorOpen, setTextEditorOpen] = useState(false);
  const { isManagement, onPinSuccess } = useManagement();

  function handleTextEditorSave() {
    setTextEditorOpen(false);
    window.location.reload();
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (isManagement) {
            // already unlocked, toggle menu
          } else {
            setOpen(true);
          }
        }}
        className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        aria-label="Управление"
        title="Управление"
      >
        <Lock className={`h-4 w-4 ${isManagement ? "text-primary" : ""}`} />
      </button>

      {isManagement && (
        <div className="absolute right-0 top-12 z-50 flex flex-col gap-2 rounded-2xl border border-border/40 bg-card p-3 shadow-xl">
          <button
            onClick={() => setTextEditorOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
          >
            <PenLine className="h-4 w-4" />
            Редактировать текст
          </button>
          <a
            href="https://github.com/firsovaellenn/elenafirsova/tree/main/public/photos"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors"
          >
            <Upload className="h-4 w-4" />
            Загрузить фото
          </a>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium hover:bg-muted transition-colors">
            <Palette className="h-4 w-4" />
            Цветовая тема
          </div>
          <div className="px-3">
            <ThemeSwitcher />
          </div>
        </div>
      )}

      <PinDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          onPinSuccess();
          setOpen(false);
        }}
      />

      <TextEditorDialog
        key={String(textEditorOpen)}
        open={textEditorOpen}
        onOpenChange={setTextEditorOpen}
        onSave={handleTextEditorSave}
      />
    </div>
  );
}
