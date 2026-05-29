"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * Error boundary global de la sección [locale]. Atrapa errores de runtime
 * y renderiza una pantalla con la marca + botón Reintentar (llama a
 * `reset()`, que vuelve a montar el subárbol). Equivalente a la 404, pero
 * para errores inesperados.
 */
export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("ErrorPage");

  return (
    <section className="bg-cream">
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center sm:px-12">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
          500
        </p>
        <h1 className="mb-4 font-serif text-4xl leading-[1.1] tracking-[-0.5px] text-green-deep sm:text-[44px]">
          {t("title")}
        </h1>
        <p className="mb-8 max-w-md font-sans text-[15px] leading-[1.6] text-ink-soft">
          {t("body")}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center bg-ochre px-8 py-[15px] font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-ochre-dark"
          >
            {t("retry")}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center border-[0.5px] border-green-deep/40 px-8 py-[15px] font-sans text-[13px] font-medium tracking-[0.5px] text-green-deep transition-colors hover:bg-green-deep/5"
          >
            {t("backHome")}
          </Link>
        </div>
      </div>
    </section>
  );
}
