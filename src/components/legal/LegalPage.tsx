import type { ReactNode } from "react";

/**
 * Layout reutilizable para páginas legales (privacidad, términos).
 * Tono editorial sobrio, ancho de lectura cómodo, jerarquía clara.
 */
export function LegalPage({
  title,
  intro,
  lastUpdate,
  draftNotice,
  children,
}: {
  title: string;
  intro: string;
  lastUpdate: string;
  draftNotice?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-20 sm:px-12 lg:px-20">
        <header className="mb-12">
          <h1 className="mb-4 font-serif text-4xl leading-[1.1] tracking-[-0.5px] text-green-deep sm:text-[44px]">
            {title}
          </h1>
          <p className="mb-6 font-sans text-[15px] leading-[1.6] text-ink-soft">
            {intro}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[2px] text-ochre">
            {lastUpdate}
          </p>
          {draftNotice ? (
            <p className="mt-6 rounded-sm border-[0.5px] border-ochre/30 bg-ochre/[0.05] px-4 py-3 font-sans text-[12px] leading-[1.5] text-ochre">
              {draftNotice}
            </p>
          ) : null}
        </header>

        <div className="space-y-10 border-t-[0.5px] border-green-deep/10 pt-10">
          {children}
        </div>
      </div>
    </section>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h2 className="mb-3 font-serif text-xl leading-[1.25] text-green-deep">
        {title}
      </h2>
      <p className="font-sans text-[14px] leading-[1.7] text-ink">{children}</p>
    </section>
  );
}
