"use client";

import { useState, useRef } from "react";
import { Award, Briefcase, Ruler, Quote, Camera } from "lucide-react";
import { aboutData } from "@/lib/data";
import { ScrollReveal } from "@/components/scroll-reveal";
import { PinDialog } from "@/components/pin-dialog";
import { loadSiteText } from "@/lib/site-text";

function ParamBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3 border-b border-border/30 last:border-0">
      <span className="text-sm uppercase tracking-wider text-muted-foreground font-medium">
        {label}
      </span>
      <span className="text-sm font-bold">{value}</span>
    </div>
  );
}

const STORAGE_KEY = "about-photo";

export function AboutSection() {
  const [photoSrc, setPhotoSrc] = useState(aboutData.photo);
  const [siteText] = useState<ReturnType<typeof loadSiteText> | null>(() => {
    if (typeof window === "undefined") return null;
    return loadSiteText();
  });
  const [pinVerified, setPinVerified] = useState(false);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const bio = siteText?.bio ?? aboutData.bio;
  const experience = siteText?.experience ?? aboutData.experience;
  const achievements = siteText?.achievements ?? aboutData.achievements;

  function handlePhotoClick() {
    if (!pinVerified) {
      setPinDialogOpen(true);
      return;
    }
    fileInputRef.current?.click();
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPhotoSrc(dataUrl);
      try {
        localStorage.setItem(STORAGE_KEY, dataUrl);
      } catch {
        /* localStorage unavailable */
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <section id="about" className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pattern-dots opacity-[0.03]" />
      <div className="container mx-auto max-w-7xl relative z-10">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-20">
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">
              About
            </p>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              О себе
            </h2>
            <div className="mx-auto h-1 w-16 bg-gradient-gold rounded-full" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-start">
          <ScrollReveal className="lg:col-span-2" delay={100}>
            <div className="relative">
              <button
                onClick={handlePhotoClick}
                className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted shadow-2xl w-full text-left group"
                aria-label={pinVerified ? "Изменить фото" : "Фото"}
              >
                <img
                  src={photoSrc}
                  alt={aboutData.photoAlt}
                  className="h-full w-full object-contain transition-all duration-500 group-hover:scale-105"
                />
                {pinVerified && (
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 p-3 rounded-full bg-white/20 backdrop-blur-sm">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                  </div>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary rounded-2xl -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 border-2 border-primary rounded-2xl -z-10" />
            </div>
          </ScrollReveal>

          <div className="lg:col-span-3 space-y-12">
            <ScrollReveal delay={200}>
              <div className="space-y-4">
                <h3 className="text-4xl sm:text-5xl font-black tracking-tighter leading-[0.9]">
                  {aboutData.name}
                </h3>
                <p className="text-sm uppercase tracking-[0.3em] text-primary font-semibold">
                  {aboutData.title}
                </p>
                <div className="h-1 w-12 bg-gradient-gold rounded-full" />
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {bio}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={300}>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Ruler className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em]">
                    Параметры
                  </h4>
                </div>
                <div className="bg-card border border-border/40 rounded-2xl p-6 shadow-sm">
                  {aboutData.parameters.map((param) => (
                    <ParamBadge
                      key={param.label}
                      label={param.label}
                      value={param.value}
                    />
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400}>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em]">
                    Опыт работы
                  </h4>
                </div>
                <div className="space-y-2">
                  {experience.map((exp) => (
                    <div
                      key={exp.period}
                      className="relative pl-10 pb-6 last:pb-0"
                    >
                      <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-primary bg-background" />
                      <div className="absolute left-[7px] top-5 bottom-0 w-0.5 bg-primary/20 last:hidden" />
                      <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">
                        {exp.period}
                      </p>
                      <p className="text-muted-foreground">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={500}>
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Award className="h-4 w-4 text-primary" />
                  </div>
                  <h4 className="text-sm font-bold uppercase tracking-[0.2em]">
                    Ключевые достижения
                  </h4>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {achievements.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/40 shadow-sm"
                    >
                      <Quote className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <PinDialog
        open={pinDialogOpen}
        onOpenChange={setPinDialogOpen}
        onSuccess={() => setPinVerified(true)}
      />
    </section>
  );
}
