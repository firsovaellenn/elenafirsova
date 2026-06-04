import { Camera, Presentation, Triangle, Building2 } from "lucide-react";
import { servicesData } from "@/lib/data";
import type { ServiceItem } from "@/lib/data";

const iconMap: Record<string, React.ReactNode> = {
  photoshoot: <Camera className="h-6 w-6" />,
  "fashion-shows": <Presentation className="h-6 w-6" />,
  advertising: <Triangle className="h-6 w-6" />,
  "brand-shoots": <Building2 className="h-6 w-6" />,
};

function ServiceCard({ service }: { service: ServiceItem }) {
  return (
    <div className="group relative flex flex-col rounded-2xl border bg-card p-6 sm:p-8 card-hover">
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {iconMap[service.id]}
      </div>

      <h3 className="text-xl font-medium tracking-tight mb-2">
        {service.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        {service.description}
      </p>

      <div className="space-y-2 mb-6 flex-1">
        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground font-medium">
          Форматы работы
        </p>
        <ul className="space-y-1.5">
          {service.formats.map((format) => (
            <li key={format} className="flex items-start gap-2 text-sm">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
              <span className="text-muted-foreground">{format}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 border-t border-border/40">
        <p className="text-xs text-muted-foreground">Стоимость</p>
        <p className="text-lg font-medium tracking-tight">
          {service.priceFrom}
        </p>
      </div>
    </div>
  );
}

export function ServicesSection() {
  return (
    <section id="services" className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Services & Pricing
          </p>
          <h2 className="text-4xl font-light tracking-tight sm:text-5xl">
            Услуги и прайс
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Профессиональные форматы сотрудничества для брендов, фотографов и
            агентств
          </p>
          <div className="mx-auto h-px w-16 bg-muted-foreground/30" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {servicesData.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
