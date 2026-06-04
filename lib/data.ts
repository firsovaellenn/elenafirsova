export interface PortfolioItem {
  id: string;
  src: string;
  alt: string;
  category: "fashion" | "beauty" | "commercial";
  title: string;
  width: number;
  height: number;
}

export const categories = [
  { id: "all", label: "Все" },
  { id: "fashion", label: "Fashion" },
  { id: "beauty", label: "Beauty" },
  { id: "commercial", label: "Commercial" },
] as const;

export const portfolioItems: PortfolioItem[] = [
  {
    id: "fashion-1",
    src: "https://picsum.photos/seed/fashion1/800/1000",
    alt: "Fashion editorial look 1",
    category: "fashion",
    title: "Editorial Spring",
    width: 800,
    height: 1000,
  },
  {
    id: "fashion-2",
    src: "https://picsum.photos/seed/fashion2/800/1200",
    alt: "Fashion editorial look 2",
    category: "fashion",
    title: "Haute Couture",
    width: 800,
    height: 1200,
  },
  {
    id: "fashion-3",
    src: "https://picsum.photos/seed/fashion3/800/800",
    alt: "Fashion editorial look 3",
    category: "fashion",
    title: "Street Style",
    width: 800,
    height: 800,
  },
  {
    id: "fashion-4",
    src: "https://picsum.photos/seed/fashion4/800/900",
    alt: "Fashion editorial look 4",
    category: "fashion",
    title: "Evening Gown",
    width: 800,
    height: 900,
  },
  {
    id: "beauty-1",
    src: "https://picsum.photos/seed/beauty1/800/800",
    alt: "Beauty portrait 1",
    category: "beauty",
    title: "Natural Glow",
    width: 800,
    height: 800,
  },
  {
    id: "beauty-2",
    src: "https://picsum.photos/seed/beauty2/800/1000",
    alt: "Beauty portrait 2",
    category: "beauty",
    title: "Bold Look",
    width: 800,
    height: 1000,
  },
  {
    id: "beauty-3",
    src: "https://picsum.photos/seed/beauty3/800/900",
    alt: "Beauty portrait 3",
    category: "beauty",
    title: "Soft Elegance",
    width: 800,
    height: 900,
  },
  {
    id: "commercial-1",
    src: "https://picsum.photos/seed/commercial1/800/600",
    alt: "Commercial shoot 1",
    category: "commercial",
    title: "Brand Campaign",
    width: 800,
    height: 600,
  },
  {
    id: "commercial-2",
    src: "https://picsum.photos/seed/commercial2/800/700",
    alt: "Commercial shoot 2",
    category: "commercial",
    title: "Lifestyle",
    width: 800,
    height: 700,
  },
  {
    id: "commercial-3",
    src: "https://picsum.photos/seed/commercial3/800/800",
    alt: "Commercial shoot 3",
    category: "commercial",
    title: "Product Shoot",
    width: 800,
    height: 800,
  },
];
