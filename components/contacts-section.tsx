"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, Send, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contactsData } from "@/lib/data";
import { ScrollReveal } from "@/components/scroll-reveal";
import { loadSiteText } from "@/lib/site-text";
import type { SiteText } from "@/lib/site-text";

const contactFormSchema = z.object({
  name: z.string().min(1, "Введите имя").max(100),
  email: z.string().min(1, "Введите email").email("Некорректный email"),
  message: z
    .string()
    .min(1, "Введите сообщение")
    .max(2000, "Сообщение слишком длинное"),
});

type ContactFormData = z.TypeOf<typeof contactFormSchema>;

const socialIcons: Record<string, React.ReactNode> = {
  instagram: <Camera className="h-5 w-5" />,
  telegram: <Send className="h-5 w-5" />,
  vk: <Globe className="h-5 w-5" />,
};

export function ContactsSection() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactFormData, string>>
  >({});
  const [contactText] = useState<SiteText["contacts"]>(() => {
    if (typeof window === "undefined") return contactsData;
    return loadSiteText().contacts;
  });

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = contactFormSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactFormData;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    const subject = encodeURIComponent(`Новый проект от ${form.name}`);
    const body = encodeURIComponent(
      `Имя: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:${contactText.businessEmail}?subject=${subject}&body=${body}`;

    setForm({ name: "", email: "", message: "" });
    toast.success("Сообщение отправлено! Я свяжусь с вами в ближайшее время.");
  };

  return (
    <section id="contacts" className="py-28 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/[0.02] to-primary/[0.04]" />
      <div className="container mx-auto max-w-7xl relative z-10">
        <ScrollReveal>
          <div className="text-center space-y-4 mb-20">
            <p className="text-xs uppercase tracking-[0.35em] text-primary font-semibold">
              Contacts
            </p>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-[0.9]">
              Контакты и связь
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-lg">
              Готова к новым проектам и сотрудничеству
            </p>
            <div className="mx-auto h-1 w-16 bg-gradient-gold rounded-full" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 max-w-5xl mx-auto">
          <ScrollReveal delay={100}>
            <div>
              <h3 className="text-2xl font-black tracking-tight mb-8">
                Напишите мне
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm font-bold mb-2 uppercase tracking-wider"
                  >
                    Имя
                  </label>
                  <Input
                    id="contact-name"
                    placeholder="Ваше имя"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                  {errors.name && (
                    <p className="text-xs text-destructive mt-1.5">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-sm font-bold mb-2 uppercase tracking-wider"
                  >
                    Email
                  </label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="h-12 rounded-xl"
                  />
                  {errors.email && (
                    <p className="text-xs text-destructive mt-1.5">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-bold mb-2 uppercase tracking-wider"
                  >
                    Сообщение
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    placeholder="Ваше сообщение..."
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="flex w-full rounded-xl border border-input bg-background px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive mt-1.5">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full rounded-xl h-13 font-bold uppercase tracking-wider"
                >
                  Отправить сообщение
                </Button>
              </form>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight mb-8">
                  Контактная информация
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/40">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${contactText.businessEmail}`}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {contactText.businessEmail}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/40">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider mb-1">
                        Локация
                      </p>
                      <p className="text-muted-foreground">Москва, Россия</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border/40">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wider mb-1">
                        Телефон
                      </p>
                      <p className="text-muted-foreground">
                        {contactText.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <p className="text-sm font-bold uppercase tracking-wider mb-5">
                  Социальные сети
                </p>
                <div className="flex flex-wrap gap-3">
                  {contactText.socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 rounded-2xl border border-border/40 bg-card px-5 py-3 text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-foreground/30 hover:shadow-sm transition-all"
                    >
                      {socialIcons[link.icon] || <Globe className="h-5 w-5" />}
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
