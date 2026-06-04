import { PortfolioGallery } from "@/components/portfolio-gallery";

export default function HomePage() {
  return (
    <>
      <div className="min-h-[calc(100vh-9rem)] flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Professional Model
            </p>
            <h1 className="text-5xl font-light tracking-tight sm:text-7xl">
              Елена
              <span className="block font-semibold">Ф.</span>
            </h1>
            <div className="mx-auto h-px w-16 bg-muted-foreground/30" />
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Fashion · Beauty · Commercial
            </p>
          </div>
          <p className="text-sm text-muted-foreground/60 max-w-sm mx-auto">
            Добро пожаловать в моё портфолио. Здесь собраны лучшие работы за
            годы сотрудничества с фотографами, брендами и агентствами.
          </p>
        </div>
      </div>
      <PortfolioGallery />
    </>
  );
}
