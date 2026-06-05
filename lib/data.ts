export interface PortfolioItem {
  id: string;
  src: string;
  alt: string;
  category: "fashion" | "beauty" | "commercial";
  title: string;
  width: number;
  height: number;
}

export interface AboutData {
  photo: string;
  photoAlt: string;
  name: string;
  title: string;
  bio: string;
  parameters: {
    label: string;
    value: string;
  }[];
  experience: {
    period: string;
    description: string;
  }[];
  achievements: string[];
}

export const aboutData: AboutData = {
  photo: "https://picsum.photos/seed/elena-profile/600/750",
  photoAlt: "Елена Фирсова — профессиональная модель",
  name: "Елена Фирсова",
  title: "Professional Model",
  bio: "Профессиональная модель с опытом работы более 15 лет. Сотрудничала с ведущими российскими и международными брендами, участвовала в показах Moscow Fashion Week и рекламных кампаниях. Специализируюсь на fashion, beauty и commercial съёмках. Люблю своё дело и подхожу к каждому проекту с полной отдачей.",
  parameters: [
    { label: "Рост", value: "175 см" },
    { label: "Размер одежды", value: "XS-S (EU 34-36)" },
    { label: "Размер обуви", value: "38.5 (EU)" },
    { label: "Цвет глаз", value: "Трехцветные: каре-серо-зелёные" },
    { label: "Цвет волос", value: "Шатен" },
    { label: "Объём груди / талия / бёдра", value: "92–62–92" },
  ],
  experience: [
    {
      period: "2024 — н.в.",
      description:
        "Сотрудничество с международными брендами, съёмки для каталогов и lookbook",
    },
    {
      period: "2023 — 2024",
      description:
        "Участие в показах Moscow Fashion Week, съёмки для глянцевых изданий",
    },
    {
      period: "2021 — 2023",
      description: "Работа с fashion-брендами, коммерческая и beauty-съёмка",
    },
    {
      period: "2019 — 2021",
      description:
        "Начало карьеры: тестовые съёмки, collaboration с фотографами",
    },
  ],
  achievements: [
    "Участница Moscow Fashion Week (2023, 2024)",
    "Лицо рекламной кампании бренда премиум-сегмента (2024)",
    "Съёмка для обложки глянцевого журнала (2023)",
    "Более 50 успешных коммерческих проектов",
  ],
};

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

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  formats: string[];
  priceFrom: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: "photoshoot",
    title: "Фотосъёмки",
    description:
      "Профессиональные фотосъёмки любого формата — от fashion editorial до beauty и lookbook. Индивидуальный подход к каждому проекту.",
    formats: [
      "Fashion editorial",
      "Beauty & портреты",
      "Lookbook",
      "Студийная и выездная съёмка",
    ],
    priceFrom: "от 15 000 ₽/час",
  },
  {
    id: "fashion-shows",
    title: "Показы",
    description:
      "Участие в показах и презентациях коллекций. Опыт работы на подиуме, дефиле, презентации для брендов и дизайнеров.",
    formats: [
      "Fashion show дефиле",
      "Презентация коллекции",
      "Репетиции и кастинги",
      "Мероприятия любой сложности",
    ],
    priceFrom: "от 30 000 ₽/выход",
  },
  {
    id: "advertising",
    title: "Реклама",
    description:
      "Съёмки для рекламных кампаний: телевизионная реклама, печатная продукция, digital-кампании и промо-материалы.",
    formats: [
      "ТВ-реклама",
      "Печатная реклама",
      "Digital-кампании",
      "Промо-видео",
    ],
    priceFrom: "от 25 000 ₽/смена",
  },
  {
    id: "brand-shoots",
    title: "Съёмки для брендов",
    description:
      "Комплексное сотрудничество с брендами: каталоги, промо-кампании, амбассадорство и долгосрочные контракты.",
    formats: [
      "Каталог продукции",
      "Бренд-кампании",
      "Амбассадорство",
      "Long-term контракты",
    ],
    priceFrom: "от 40 000 ₽/смена",
  },
];

export interface TestimonialItem {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

export const testimonialsData: TestimonialItem[] = [
  {
    id: "t-1",
    quote:
      "Работа с Еленой — одно удовольствие. Профессиональный подход, пунктуальность и полная самоотдача на съёмочной площадке. Рекомендую как одного из самых ответственных моделей, с кем мне доводилось работать.",
    name: "Алексей Соколов",
    role: "Фотограф, основатель Sokolov Studio",
  },
  {
    id: "t-2",
    quote:
      "Елена стала лицом нашей весенней кампании 2024. Она невероятно точно передала настроение коллекции, а её профессионализм и лёгкость в общении сделали процесс съёмки максимально комфортным для всей команды.",
    name: "Анна Белова",
    role: "Бренд-менеджер, MODA Russia",
  },
  {
    id: "t-3",
    quote:
      "Сотрудничаем с Еленой на постоянной основе уже второй год. Она идеально подходит для наших commercial проектов — быстро понимает задачу, отлично держится в кадре и всегда открыта к экспериментам.",
    name: "Дмитрий Козлов",
    role: "Креативный директор, Bright Agency",
  },
  {
    id: "t-4",
    quote:
      "Елена участвовала в нашем показе на Moscow Fashion Week. Потрясающая походка, умение работать с публикой и невероятная харизма. Обязательно пригласим её снова в новом сезоне.",
    name: "Екатерина Морозова",
    role: "Организатор, Moscow Fashion Week",
  },
  {
    id: "t-5",
    quote:
      "Мы работали с Еленой над съёмкой каталога нижнего белья. Результат превзошёл ожидания — она не только профессионально держится в кадре, но и помогает команде чувствовать себя уверенно. Настоящий профессионал.",
    name: "Иван Петров",
    role: "Продюсер, Petrov Production",
  },
];

export interface ContactSocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface ContactsData {
  email: string;
  businessEmail: string;
  socialLinks: ContactSocialLink[];
}

export const contactsData: ContactsData = {
  email: "elena.f@example.com",
  businessEmail: "elena.f@example.com",
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com/", icon: "instagram" },
    { label: "Telegram", href: "https://t.me/", icon: "telegram" },
    { label: "VK", href: "https://vk.com/", icon: "vk" },
  ],
};
