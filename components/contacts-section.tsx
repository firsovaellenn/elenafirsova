"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Camera, Send, Globe, Mail, MapPin, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { contactsData } from "@/lib/data";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    setIsSubmitting(true);

    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setForm({ name: "", email: "", message: "" });
    toast.success("Сообщение отправлено! Я свяжусь с вами в ближайшее время.");
  };

  return (
    <section id="contacts" className="py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Contacts
          </p>
          <h2 className="text-4xl font-light tracking-tight sm:text-5xl">
            Контакты и связь
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Готова к новым проектам и сотрудничеству
          </p>
          <div className="mx-auto h-px w-16 bg-muted-foreground/30" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 max-w-5xl mx-auto">
          <div>
            <h3 className="text-xl font-medium tracking-tight mb-6">
              Напишите мне
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium mb-1.5"
                >
                  Имя
                </label>
                <Input
                  id="contact-name"
                  placeholder="Ваше имя"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
                {errors.name && (
                  <p className="text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium mb-1.5"
                >
                  Email
                </label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium mb-1.5"
                >
                  Сообщение
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Ваше сообщение..."
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
                {errors.message && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправка..." : "Отправить сообщение"}
              </Button>
            </form>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-medium tracking-tight mb-6">
                Контактная информация
              </h3>

              <div className="space-y-5">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <a
                      href={`mailto:${contactsData.businessEmail}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {contactsData.businessEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Локация</p>
                    <p className="text-sm text-muted-foreground">
                      Москва, Россия
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Телефон</p>
                    <p className="text-sm text-muted-foreground">
                      +7 (999) 123-45-67
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10">
              <p className="text-sm font-medium mb-4">Социальные сети</p>
              <div className="flex flex-wrap gap-3">
                {contactsData.socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors"
                  >
                    {socialIcons[link.icon] || <Globe className="h-5 w-5" />}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
