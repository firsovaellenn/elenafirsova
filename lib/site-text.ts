"use client";

import { aboutData, servicesData, contactsData } from "@/lib/data";

export interface SiteText {
  hero: {
    subtitle: string;
    name: string;
    surname: string;
    tags: string;
    description: string;
  };
  bio: string;
  experience: { period: string; description: string }[];
  achievements: string[];
  services: {
    id: string;
    title: string;
    description: string;
    formats: string[];
    priceFrom: string;
  }[];
  contacts: {
    email: string;
    businessEmail: string;
    phone: string;
    socialLinks: { label: string; href: string; icon: string }[];
  };
}

const STORAGE_KEY = "site-text";

export function loadSiteText(): SiteText {
  if (typeof window === "undefined") {
    return getDefaults();
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaults();
    return JSON.parse(raw) as SiteText;
  } catch {
    return getDefaults();
  }
}

export function saveSiteText(text: SiteText) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(text));
  } catch {
    console.error("Failed to save site text to localStorage");
  }
}

function getDefaults(): SiteText {
  return {
    hero: {
      subtitle: "Professional Model",
      name: "Елена",
      surname: "Фирсова",
      tags: "Fashion · Beauty · Commercial",
      description: "Добро пожаловать в моё портфолио. Здесь собраны лучшие работы за годы сотрудничества с фотографами, известными брендами и агентствами.",
    },
    bio: aboutData.bio,
    experience: aboutData.experience,
    achievements: aboutData.achievements,
    services: servicesData.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      formats: s.formats,
      priceFrom: s.priceFrom,
    })),
    contacts: {
      email: contactsData.email,
      businessEmail: contactsData.businessEmail,
      phone: contactsData.phone,
      socialLinks: contactsData.socialLinks,
    },
  };
}
