import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t-[0.5px] border-cream/10 bg-green-deep text-cream">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 pb-6 pt-8 sm:flex-row sm:items-center sm:px-8">
        <Link href="/" aria-label="Campero Overland" className="opacity-85">
          <Image
            src="/logos/logo-mono-crema.png"
            alt="Campero Overland"
            width={135}
            height={44}
            className="h-11 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-5 font-sans text-[12px] text-cream/60">
          <Link
            href="/privacidad"
            className="transition-colors hover:text-cream"
          >
            {t("privacyLink")}
          </Link>
          <Link
            href="/terminos"
            className="transition-colors hover:text-cream"
          >
            {t("termsLink")}
          </Link>
        </nav>

        <span className="font-mono text-[10px] uppercase tracking-[2px] text-cream/60">
          {t("tagline")}
        </span>
      </div>
    </footer>
  );
}
