import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const NAV_ITEMS = [
  { key: "product", href: "/" },
  { key: "configurator", href: "/configurador" },
  { key: "history", href: "/historia" },
  { key: "contact", href: "/contacto" },
] as const;

export function Header() {
  const t = useTranslations("Navigation");

  return (
    <header className="relative z-10 bg-green-deep text-cream">
      <div className="flex items-center justify-between px-6 py-[18px] sm:px-8">
        <Link href="/" aria-label="Campero Overland">
          <Image
            src="/logos/logo-mono-crema.png"
            alt="Campero Overland"
            width={160}
            height={52}
            priority
            className="h-[52px] w-auto"
          />
        </Link>

        <nav
          aria-label="Principal"
          className="hidden gap-7 font-sans text-[13px] md:flex"
        >
          {NAV_ITEMS.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="transition-colors hover:text-ochre"
            >
              {t(key)}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
