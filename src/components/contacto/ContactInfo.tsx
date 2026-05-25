import { Mail, MapPin, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

export function ContactInfo() {
  const t = useTranslations("Contact.alternatives");

  const whatsappValue = t("whatsappValue");
  const isWhatsappPlaceholder = whatsappValue.includes("XXXX");
  const whatsappHref = isWhatsappPlaceholder
    ? undefined
    : `https://wa.me/${whatsappValue.replace(/[^\d]/g, "")}`;

  return (
    <aside className="space-y-8">
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[3px] text-ochre">
          {t("title")}
        </p>
      </header>

      <ul className="space-y-7">
        <Item
          icon={<MessageCircle aria-hidden className="h-5 w-5 text-ochre" />}
          label={t("whatsappLabel")}
        >
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[14px] text-green-deep transition-colors hover:text-ochre"
            >
              {whatsappValue}
            </a>
          ) : (
            <span className="font-sans text-[14px] text-ink-soft">
              {whatsappValue}
            </span>
          )}
        </Item>

        <Item
          icon={<Mail aria-hidden className="h-5 w-5 text-ochre" />}
          label={t("emailLabel")}
        >
          <a
            href={`mailto:${t("emailValue")}`}
            className="font-sans text-[14px] text-green-deep transition-colors hover:text-ochre"
          >
            {t("emailValue")}
          </a>
        </Item>

        <Item
          icon={<MapPin aria-hidden className="h-5 w-5 text-ochre" />}
          label={t("locationLabel")}
        >
          <p className="font-sans text-[14px] text-green-deep">
            {t("locationValue")}
          </p>
          <p className="mt-0.5 font-sans text-[12px] italic text-ink-soft">
            {t("visitsNote")}
          </p>
        </Item>
      </ul>
    </aside>
  );
}

function Item({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <li className="flex items-start gap-4">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div className="flex-1">
        <p className="mb-1 font-mono text-[9px] uppercase tracking-[2px] text-ink-soft">
          {label}
        </p>
        {children}
      </div>
    </li>
  );
}
