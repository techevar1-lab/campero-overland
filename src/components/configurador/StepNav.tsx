"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function StepNav({
  canGoBack,
  canGoNext,
  onBack,
  onNext,
}: {
  canGoBack: boolean;
  canGoNext: boolean;
  onBack?: () => void;
  onNext?: () => void;
}) {
  const t = useTranslations("Configurator.nav");

  return (
    <nav className="mt-10 flex items-center justify-between gap-3 border-t-[0.5px] border-green-deep/10 pt-8">
      {canGoBack ? (
        <Button variant="ghost" onClick={onBack}>
          {t("back")}
        </Button>
      ) : (
        <span aria-hidden />
      )}
      <Button variant="primary" disabled={!canGoNext} onClick={onNext}>
        {t("next")}
      </Button>
    </nav>
  );
}
