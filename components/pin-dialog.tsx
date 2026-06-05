"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const PIN_CODE = "3007";

export function PinDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  function handleSubmit() {
    if (value === PIN_CODE) {
      onSuccess();
      onOpenChange(false);
      toast.success("Доступ разрешён");
    } else {
      toast.error("Неверный код");
      setValue("");
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-background rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-black tracking-tight">
            Доступ к управлению
          </h3>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted-foreground">
              Введите пин-код для доступа к управлению фото
            </p>
          </div>

          <Input
            ref={inputRef}
            type="password"
            maxLength={10}
            placeholder="Пин-код"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className="text-center text-lg tracking-[0.3em]"
          />

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 rounded-xl"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button
              className="flex-1 rounded-xl"
              onClick={handleSubmit}
              disabled={!value}
            >
              Подтвердить
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
