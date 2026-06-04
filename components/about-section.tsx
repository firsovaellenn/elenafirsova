import { Award, Briefcase, Ruler } from "lucide-react";
import { aboutData } from "@/lib/data";

function ParamBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2 border-b border-border/40 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

function ExperienceCard({
  period,
  description,
}: {
  period: string;
  description: string;
}) {
  return (
    <div className="relative pl-8 pb-8 last:pb-0">
      <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full border-2 border-primary bg-background" />
      <div className="absolute left-[5px] top-5 bottom-0 w-px bg-border last:hidden" />
      <p className="text-xs text-muted-foreground mb-1">{period}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            About
          </p>
          <h2 className="text-4xl font-light tracking-tight sm:text-5xl">
            О себе
          </h2>
          <div className="mx-auto h-px w-16 bg-muted-foreground/30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
              <img
                src={aboutData.photo}
                alt={aboutData.photoAlt}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-10">
            <div className="space-y-4">
              <h3 className="text-2xl font-light tracking-tight">
                {aboutData.name}
              </h3>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                {aboutData.title}
              </p>
              <div className="h-px w-12 bg-muted-foreground/30" />
              <p className="text-muted-foreground leading-relaxed">
                {aboutData.bio}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium uppercase tracking-[0.15em]">
                  Параметры
                </h4>
              </div>
              <div className="bg-muted/50 rounded-xl p-5">
                {aboutData.parameters.map((param) => (
                  <ParamBadge
                    key={param.label}
                    label={param.label}
                    value={param.value}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium uppercase tracking-[0.15em]">
                  Опыт работы
                </h4>
              </div>
              <div>
                {aboutData.experience.map((exp) => (
                  <ExperienceCard
                    key={exp.period}
                    period={exp.period}
                    description={exp.description}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" />
                <h4 className="text-sm font-medium uppercase tracking-[0.15em]">
                  Ключевые достижения
                </h4>
              </div>
              <ul className="space-y-2">
                {aboutData.achievements.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
