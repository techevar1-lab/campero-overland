import { Mail, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const NAV_ITEMS = [
  { key: "product", href: "/" },
  { key: "configurator", href: "/configurador" },
  { key: "custom", href: "/a-medida" },
  { key: "history", href: "/historia" },
  { key: "contact", href: "/contacto" },
] as const;

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");
  const tContact = useTranslations("Contact.alternatives");

  const whatsapp = tContact("whatsappValue");
  const whatsappHref = whatsapp.includes("XXXX")
    ? undefined
    : `https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`;
  const email = tContact("emailValue");

  return (
    <footer className="border-t-[0.5px] border-cream/10 bg-green-deep text-cream">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
          {/* Marca */}
          <div>
            <Link
              href="/"
              aria-label="Campero Overland"
              className="inline-block opacity-90"
            >
              <Image
                src="/logos/logo-mono-crema.png"
                alt="Campero Overland"
                width={150}
                height={49}
                className="h-12 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs font-sans text-[13px] leading-[1.6] text-cream/60">
              {t("blurb")}
            </p>
          </div>

          {/* Navegación */}
          <nav aria-label={t("navHeading")}>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[2px] text-ochre">
              {t("navHeading")}
            </p>
            <ul className="flex flex-col gap-2.5">
              {NAV_ITEMS.map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={href}
                    className="font-sans text-[13px] text-cream/70 transition-colors hover:text-cream"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contacto */}
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[2px] text-ochre">
              {t("contactHeading")}
            </p>
            <ul className="flex flex-col gap-2.5 font-sans text-[13px] text-cream/70">
              <li>
                <a
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-cream"
                >
                  <Mail aria-hidden className="h-4 w-4 text-ochre" />
                  {email}
                </a>
              </li>
              {whatsappHref ? (
                <li>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-cream"
                  >
                    <MessageCircle aria-hidden className="h-4 w-4 text-ochre" />
                    {whatsapp}
                  </a>
                </li>
              ) : null}
              <li className="text-cream/60">{tContact("locationValue")}</li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t-[0.5px] border-cream/10 pt-6 sm:flex-row sm:items-center">
          <nav className="flex items-center gap-5 font-sans text-[12px] text-cream/60">
            <Link href="/privacidad" className="transition-colors hover:text-cream">
              {t("privacyLink")}
            </Link>
            <Link href="/terminos" className="transition-colors hover:text-cream">
              {t("termsLink")}
            </Link>
          </nav>
          <span className="font-mono text-[10px] uppercase tracking-[2px] text-cream/60">
            {t("tagline")}
          </span>
        </div>
      </div>
    </footer>
  );
}
