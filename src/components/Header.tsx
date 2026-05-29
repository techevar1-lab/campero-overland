"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";

const NAV_ITEMS = [
  { key: "product", href: "/" },
  { key: "configurator", href: "/configurador" },
  { key: "custom", href: "/a-medida" },
  { key: "history", href: "/historia" },
  { key: "contact", href: "/contacto" },
] as const;

export function Header() {
  const t = useTranslations("Navigation");
  const [open, setOpen] = useState(false);

  return (
    <header className="relative z-20 bg-green-deep text-cream">
      <div className="flex items-center justify-between px-6 py-[18px] sm:px-8">
        <Link
          href="/"
          aria-label="Campero Overland"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/logos/logo-mono-crema.png"
            alt="Campero Overland"
            width={160}
            height={52}
            priority
            className="h-[52px] w-auto"
          />
        </Link>

        {/* Nav desktop */}
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

        {/* Toggle móvil */}
        <button
          type="button"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((prev) => !prev)}
          className="-mr-2 inline-flex items-center justify-center p-2 text-cream transition-colors hover:text-ochre focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ochre md:hidden"
        >
          {open ? (
            <X aria-hidden width={24} height={24} strokeWidth={1.5} />
          ) : (
            <Menu aria-hidden width={24} height={24} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Nav móvil desplegable */}
      {open ? (
        <nav
          id="mobile-nav"
          aria-label="Principal"
          className="border-t border-cream/10 px-6 pb-3 sm:px-8 md:hidden"
        >
          <ul className="flex flex-col">
            {NAV_ITEMS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-cream/10 py-3.5 font-sans text-[15px] transition-colors hover:text-ochre"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
