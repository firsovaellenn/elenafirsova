"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { loadSiteText } from "@/lib/site-text";

export function HeaderBrand() {
  const [title] = useState(() => {
    const text = loadSiteText();
    return text?.headerTitle || "Елена Фирсова";
  });

  return (
    <Link
      href="/"
      className="flex items-center gap-2 text-xl font-bold tracking-tight"
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="h-5 w-5" />
      </div>
      {title}
    </Link>
  );
}
