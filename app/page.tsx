"use client";

import { useState, useEffect } from "react";
import { PortfolioGallery } from "@/components/portfolio-gallery";
import { AboutSection } from "@/components/about-section";
import { ServicesSection } from "@/components/services-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { ContactsSection } from "@/components/contacts-section";
import { loadSiteText } from "@/lib/site-text";

export default function HomePage() {
  const [hero, setHero] = useState({
    subtitle: "Professional Model",
    name: "Елена",
    surname: "Фирсова",
    tags: "Fashion · Beauty · Commercial",
    description: "Добро пожаловать в моё портфолио. Здесь собраны лучшие работы за годы сотрудничества с фотографами, брендами и агентствами.",
  });

  useEffect(() => {
    const text = loadSiteText();
    if (text?.hero) {
      setHero(text.hero);
    }
  }, []);

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 gradient-glossy-light" />
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">
                {hero.subtitle}
              </p>
              <h1 className="text-7xl sm:text-8xl md:text-9xl font-black tracking-tighter leading-[0.85] text-balance">
                {hero.name}
                <span className="block text-primary">{hero.surname}</span>
              </h1>
              <div className="h-1.5 w-24 bg-gradient-gold rounded-full" />
              <p className="text-xl sm:text-2xl text-muted-foreground max-w-xl font-light tracking-wide">
                {hero.tags}
              </p>
              <p className="text-base text-muted-foreground/70 max-w-md leading-relaxed">
                {hero.description}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a
                  href="#portfolio"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider hover:opacity-90 transition-all"
                >
                  Смотреть портфолио
                </a>
                <a
                  href="#contacts"
                  className="inline-flex items-center gap-2 border-2 border-foreground/20 text-foreground px-8 py-3 rounded-full text-sm font-semibold uppercase tracking-wider hover:border-foreground/40 transition-all"
                >
                  Связаться
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
          <div className="w-6 h-12 border-2 border-foreground/20 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-3 animate-bounce" />
          </div>
        </div>
      </section>
      <AboutSection />
      <ServicesSection />
      <PortfolioGallery />
      <TestimonialsSection />
      <ContactsSection />
    </>
  );
}
