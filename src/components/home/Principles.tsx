import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";

export function Principles() {
  const t = useTranslations("HomePage.Principles");

  const items = [
    { label: t("p1Label"), title: t("p1Title"), body: t("p1Body") },
    { label: t("p2Label"), title: t("p2Title"), body: t("p2Body") },
  ];

  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 pb-20 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {items.map((item) => (
            <Card key={item.label}>
              <p className="mb-3.5 font-mono text-[10px] uppercase tracking-[2px] text-ochre">
                {item.label}
              </p>
              <h3 className="mb-3 font-serif text-2xl leading-[1.2] text-green-deep">
                {item.title}
              </h3>
              <p className="font-sans text-[13px] leading-[1.65] text-ink-soft">
                {item.body}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
