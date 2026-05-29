import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Faq");
  return {
    title: "Preguntas frecuentes · Campero Overland",
    description: t("metaDescription"),
  };
}

// Mapeo de preguntas → categoría. Cuando crezca la FAQ, mover a data/.
// Categorías sin items se omiten (no renderean sección vacía).
const QUESTIONS_BY_CATEGORY: Record<string, string[]> = {
  product: ["q1", "q2", "q3"],
  purchase: ["q4"],
  shipping: ["q5"],
  warranty: ["q6"],
  accessories: [],
};

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Faq");

  const populatedCategories = Object.entries(QUESTIONS_BY_CATEGORY).filter(
    ([, ids]) => ids.length > 0,
  );

  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-12 lg:px-20">
        <header className="mb-16">
          <h1 className="font-serif text-4xl leading-[1.1] tracking-[-0.5px] text-green-deep sm:text-[44px]">
            {t("title")}
          </h1>
        </header>

        <div className="space-y-16">
          {populatedCategories.map(([catId, ids]) => (
            <CategorySection
              key={catId}
              label={t(`categories.${catId}` as `categories.${"product"}`)}
              items={ids.map((id) => ({
                id,
                question: t(`items.${id}` as `items.${"q1"}`),
                answer: t(
                  `items.${id.replace("q", "a")}` as `items.${"a1"}`,
                ),
              }))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CategorySection({
  label,
  items,
}: {
  label: string;
  items: { id: string; question: string; answer: string }[];
}) {
  return (
    <section>
      <p className="mb-4 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
        {label}
      </p>
      <div className="border-t-[0.5px] border-green-deep/10">
        {items.map((item) => (
          <details
            key={item.id}
            className="group border-b-[0.5px] border-green-deep/10"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 transition-colors hover:text-green-deep [&::-webkit-details-marker]:hidden">
              <span className="font-serif text-lg leading-[1.3] text-green-deep">
                {item.question}
              </span>
              <ChevronDown
                aria-hidden
                className="details-chevron h-5 w-5 shrink-0 text-ochre transition-transform"
              />
            </summary>
            <p className="pb-6 font-sans text-sm leading-[1.65] text-ink-soft">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
