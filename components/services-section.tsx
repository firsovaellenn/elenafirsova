"use client";

import { useState } from "react";
import { Camera, Presentation, Triangle, Building2 } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";
import { loadSiteText } from "@/lib/site-text";
import type { SiteText } from "@/lib/site-text";

const iconMap: Record<string, React.ReactNode> = {
  photoshoot: <Camera className="h-6 w-6" />,
  "fashion-shows": <Presentation className="h-6 w-6" />,
  advertising: <Triangle className="h-6 w-6" />,
  "brand-shoots": <Building2 className="h-6 w-6" />,
};

function ServiceCard({
  service,
  index,
}: {
  service: SiteText["services"][number];
  index: number;
}) {
  return (
    <ScrollReveal delay={index * 100}>
      <div className="group relative flex flex-col rounded-3xl border border-border/40 bg-card p-8 shadow-sm hover:shadow-xl transition-all duration-500">
        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-3xl -z-0" />
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          {iconMap[service.id]}
        </div>

        <h3 className="text-2xl font-black tracking-tight mb-3">
          {service.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {service.description}
        </p>

        <div className="space-y-3 flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-bold">
            Форматы работы
          </p>
          <ul className="space-y-2.5">
            {service.formats.map((format) => (
              <li key={format} className="flex items-start gap-3 text-sm">
                <span className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                <span className="text-muted-foreground">{format}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ScrollReveal>
  );
}

export function ServicesSection() {
  const [services] = useState<SiteText["services"]>(() => {
    if (typeof window === "undefined") return [];
    return loadSiteText().services;
  });

  if (services.length === 0) return null;

  return (
    <section id="services" className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-background" />
      <div className="container mx-auto max-w-7xl relative z-10">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-20">
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">
              Services & Pricing
            </p>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter leading-[0.9]">
              Профессиональные форматы сотрудничества
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Услуги и прайс для брендов, фотографов и агентств
            </p>
            <div className="mx-auto h-1 w-16 bg-gradient-gold rounded-full" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
