import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("Footer");

  return (
    <footer className="border-t-[0.5px] border-cream/10 bg-green-deep text-cream">
      <div className="flex flex-col items-start justify-between gap-4 px-6 pb-6 pt-8 sm:flex-row sm:items-center sm:px-8">
        <Link href="/" aria-label="Campero Overland" className="opacity-85">
          <Image
            src="/logos/logo-mono-crema.png"
            alt="Campero Overland"
            width={135}
            height={44}
            className="h-11 w-auto"
          />
        </Link>

        <span className="font-mono text-[10px] uppercase tracking-[2px] text-cream/60">
          {t("tagline")}
        </span>
      </div>
    </footer>
  );
}
