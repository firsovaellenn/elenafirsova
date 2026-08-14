"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { PinDialog } from "@/components/pin-dialog";
import { useManagement } from "@/components/management-context";

export function HeaderManagementButton() {
  const [open, setOpen] = useState(false);
  const { isManagement, onPinSuccess } = useManagement();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center h-9 w-9 rounded-full border border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
        aria-label="Управление"
        title="Управление"
      >
        <Lock className="h-4 w-4" />
      </button>
      <PinDialog
        open={open}
        onOpenChange={setOpen}
        onSuccess={() => {
          onPinSuccess();
          setOpen(false);
        }}
      />
    </>
  );
}
