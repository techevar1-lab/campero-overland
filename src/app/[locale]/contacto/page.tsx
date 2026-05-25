import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/contacto/ContactForm";
import { ContactInfo } from "@/components/contacto/ContactInfo";

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Contact");

  return (
    <section>
      <div className="mx-auto max-w-5xl px-6 py-20 sm:px-12 lg:px-20">
        <header className="mb-16 max-w-2xl">
          <h1 className="mb-4 font-serif text-4xl leading-[1.1] tracking-[-0.5px] text-green-deep sm:text-[44px]">
            {t("title")}
          </h1>
          <p className="font-sans text-[15px] leading-[1.6] text-ink-soft">
            {t("subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          <ContactForm />
          <ContactInfo />
        </div>
      </div>
    </section>
  );
}
