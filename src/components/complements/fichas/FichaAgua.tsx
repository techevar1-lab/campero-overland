"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import accesoriosData from "@data/accesorios.json";
import { formatPrice, type Price } from "@/lib/format";

type Size = 6 | 10 | 19;
type Tab = "diagram" | "dimensions" | "components";

const SIZE_DATA: Record<
  Size,
  { ancho: string; prof: string; alto: string; peso: string; auto: string }
> = {
  6: {
    ancho: "125 mm",
    prof: "150 mm",
    alto: "215 mm",
    peso: "~6 kg",
    auto: "~3 días",
  },
  10: {
    ancho: "145 mm",
    prof: "175 mm",
    alto: "240 mm",
    peso: "~10 kg",
    auto: "~5 días",
  },
  19: {
    ancho: "190 mm",
    prof: "195 mm",
    alto: "295 mm",
    peso: "~19 kg",
    auto: "~9 días",
  },
};

function getWaterPrices(): { size: Size; price: Price }[] {
  const group = (accesoriosData as { groups: { id: string; variants: { id: string; price: Price }[] }[] }).groups.find(
    (g) => g.id === "water",
  );
  if (!group) return [];
  const map: Record<string, Size> = {
    water_6: 6,
    water_10: 10,
    water_19: 19,
  };
  return group.variants.map((v) => ({
    size: map[v.id] ?? 10,
    price: v.price,
  }));
}

export function FichaAgua() {
  const t = useTranslations("FichaAgua");
  const [tab, setTab] = useState<Tab>("diagram");
  const [size, setSize] = useState<Size>(10);
  const dims = SIZE_DATA[size];
  const prices = getWaterPrices();

  return (
    <article className="font-sans text-ink">
      {/* HEADER */}
      <header className="grid grid-cols-1 items-center gap-2 border-b-2 border-green-deep bg-green-deep px-6 py-4 text-cream sm:grid-cols-3 sm:gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[2px] text-ochre">
            {t("brand")}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[2px] text-cream/55">
            {t("location")}
          </p>
        </div>
        <div className="text-left sm:text-center">
          <h2 className="font-serif text-2xl leading-none tracking-[-0.5px] text-cream">
            {t("title")}
          </h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[2px] text-cream/60">
            {t("subtitle")}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[2px] text-cream/55">
            {t("docTag")}
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[2px] text-cream/55">
            {t("rev")}
          </p>
        </div>
      </header>

      {/* TABS */}
      <div
        role="tablist"
        aria-label={t("tabsAriaLabel")}
        className="flex flex-wrap border-b-2 border-green-deep bg-cream"
      >
        {(["diagram", "dimensions", "components"] as Tab[]).map((id, i) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`ficha-agua-panel-${id}`}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 border-r border-green-deep/15 px-5 py-3.5 font-mono text-[11px] uppercase tracking-[2px] transition-colors ${
                isActive
                  ? "border-b-2 border-b-ochre bg-cream text-ochre"
                  : "border-b-2 border-b-transparent text-ink-soft hover:text-ink"
              }`}
            >
              <span className="text-[10px] text-ochre">0{i + 1}</span>
              <span>{t(`tabs.${id}` as never)}</span>
            </button>
          );
        })}
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        {/* CONTENT AREA */}
        <section
          id={`ficha-agua-panel-${tab}`}
          role="tabpanel"
          className="flex flex-col gap-6 border-b border-green-deep/15 p-6 lg:border-b-0 lg:border-r-2 lg:border-r-green-deep lg:p-8"
        >
          {tab === "diagram" ? <DiagramTab /> : null}
          {tab === "dimensions" ? <DimensionsTab /> : null}
          {tab === "components" ? <ComponentsTab /> : null}
        </section>

        {/* SIDEBAR */}
        <aside className="flex flex-col gap-6 p-6">
          {/* SIZE SELECTOR */}
          <section>
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
              {t("sidebar.sizeLabel")}
            </p>
            <div className="flex gap-2">
              {([6, 10, 19] as Size[]).map((s) => {
                const active = size === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`flex flex-1 flex-col items-center gap-0.5 border-[1.5px] px-2 py-2.5 transition-colors ${
                      active
                        ? "border-green-deep bg-green-deep text-cream"
                        : "border-line text-ink hover:border-green-deep"
                    }`}
                  >
                    <span className="font-serif text-lg leading-none">{s}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[1.5px] opacity-70">
                      {t("sidebar.litros")}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* DIMENSIONS TABLE */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
              {t("sidebar.dimsLabel")}
            </p>
            <dl className="grid grid-cols-2 gap-y-2">
              <DimRow label={t("sidebar.anchoInterior")} value={dims.ancho} highlight />
              <DimRow label={t("sidebar.profundidad")} value={dims.prof} />
              <DimRow label={t("sidebar.altoLibre")} value={dims.alto} />
              <DimRow label={t("sidebar.holguraLateral")} value={t("sidebar.holguraLateralValue")} />
              <DimRow label={t("sidebar.holguraSuperior")} value={t("sidebar.holguraSuperiorValue")} />
              <DimRow label={t("sidebar.espesorPared")} value={t("sidebar.espesorParedValue")} />
              <DimRow label={t("sidebar.pesoBidon")} value={dims.peso} />
              <DimRow label={t("sidebar.autonomia")} value={dims.auto} />
            </dl>
          </section>

          {/* BOMBA SPECS */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
              {t("sidebar.specsLabel")}
            </p>
            <ul className="bg-green-deep p-3.5 font-mono text-[10px] leading-relaxed text-cream/85">
              <SpecRow k={t("sidebar.specs.modeloKey")} v={t("sidebar.specs.modeloValue")} />
              <SpecRow k={t("sidebar.specs.caudalKey")} v={t("sidebar.specs.caudalValue")} />
              <SpecRow k={t("sidebar.specs.presionKey")} v={t("sidebar.specs.presionValue")} />
              <SpecRow k={t("sidebar.specs.consumoKey")} v={t("sidebar.specs.consumoValue")} />
              <SpecRow k={t("sidebar.specs.entradaKey")} v={t("sidebar.specs.entradaValue")} />
              <SpecRow k={t("sidebar.specs.ruidoKey")} v={t("sidebar.specs.ruidoValue")} />
              <SpecRow k={t("sidebar.specs.dimsKey")} v={t("sidebar.specs.dimsValue")} />
            </ul>
          </section>

          {/* PRECIOS */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
              {t("sidebar.pricesLabel")}
            </p>
            <ul className="flex flex-col">
              {prices.map((p, i) => (
                <li
                  key={p.size}
                  className={`flex items-center justify-between gap-3 py-2 ${
                    i < prices.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-ink">
                    {t("sidebar.priceRowLabel", { size: p.size })}
                  </span>
                  <span className="font-mono text-[11px] font-medium text-ochre">
                    {formatPrice(p.price)}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* COMPARATIVA */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
              {t("sidebar.comparativeLabel")}
            </p>
            <ul className="flex flex-col gap-1.5 font-sans text-[12px] text-ink">
              <CompRow text={t("sidebar.compare6")} value={t("sidebar.compare6Value")} />
              <CompRow text={t("sidebar.compare10")} value={t("sidebar.compare10Value")} highlight />
              <CompRow text={t("sidebar.compare19")} value={t("sidebar.compare19Value")} last />
            </ul>
          </section>

          {/* FOOTER BLOCK */}
          <section className="bg-green-deep p-3.5 font-mono text-[9px] uppercase leading-relaxed tracking-[1.5px] text-cream/70">
            <p>{t("sidebar.footerOrigin")}</p>
            <p className="text-ochre">{t("sidebar.footerBrand")}</p>
            <p>{t("sidebar.footerTagline")}</p>
          </section>
        </aside>
      </div>
    </article>
  );
}

/* ============ SUBCOMPONENTS ============ */

function DimRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <>
      <dt className="font-mono text-[10px] uppercase tracking-[1.5px] text-ink-soft">
        {label}
      </dt>
      <dd
        className={`text-right font-mono ${
          highlight
            ? "text-[14px] font-medium text-ochre"
            : "text-[12px] text-ink"
        }`}
      >
        {value}
      </dd>
    </>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex gap-2">
      <span className="w-24 shrink-0 text-ochre">{k}</span>
      <span>{v}</span>
    </li>
  );
}

function CompRow({
  text,
  value,
  highlight,
  last,
}: {
  text: string;
  value: string;
  highlight?: boolean;
  last?: boolean;
}) {
  return (
    <li
      className={`flex items-center justify-between gap-3 py-1 ${
        last ? "" : "border-b border-dashed border-line"
      }`}
    >
      <span className="text-ink-soft">{text}</span>
      <span
        className={
          highlight
            ? "font-mono text-[11px] tracking-[1px] text-ochre"
            : "font-mono text-[11px] tracking-[1px] text-ink-soft"
        }
      >
        {value}
      </span>
    </li>
  );
}

/* ============ TAB CONTENTS ============ */

function TabHeader({
  label,
  titleParts,
}: {
  label: string;
  titleParts: { plain: string; em: string };
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
        {label}
      </p>
      <h3 className="font-serif text-[28px] leading-tight tracking-[-0.5px] text-green-deep">
        {titleParts.plain}{" "}
        <em className="italic text-ochre">{titleParts.em}</em>
      </h3>
    </div>
  );
}

function DiagramTab() {
  const t = useTranslations("FichaAgua.diagram");
  return (
    <>
      <TabHeader
        label={t("label")}
        titleParts={{ plain: t("titlePlain"), em: t("titleEm") }}
      />

      <div className="border border-green-deep/15 bg-cream-pure p-4">
        <DiagramSVG />
      </div>

      <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[1.5px] text-ink">
        <LegendItem color="#4a7ca8" label={t("legend.water")} />
        <LegendItem color="#B8763A" label={t("legend.power")} />
        <LegendItem color="#c4956a" label={t("legend.wood")} />
        <LegendItem color="#5fb360" label={t("legend.active")} />
      </ul>

      <p className="border-l-[3px] border-ochre bg-ochre/[0.08] px-3.5 py-3 font-sans text-[12px] leading-[1.55] text-ink">
        <strong className="font-medium text-ink">{t("noteTitle")}:</strong>{" "}
        {t("noteBody")}
      </p>
    </>
  );
}

function DimensionsTab() {
  const t = useTranslations("FichaAgua.dimensions");
  return (
    <>
      <TabHeader
        label={t("label")}
        titleParts={{ plain: t("titlePlain"), em: t("titleEm") }}
      />
      <div className="border border-green-deep/15 bg-cream-pure p-4">
        <DimensionsSVG />
      </div>
      <p className="font-mono text-[9px] uppercase tracking-[2px] text-ink-soft">
        {t("scaleNote")}
      </p>
    </>
  );
}

function ComponentsTab() {
  const t = useTranslations("FichaAgua.components");
  return (
    <>
      <TabHeader
        label={t("label")}
        titleParts={{ plain: t("titlePlain"), em: t("titleEm") }}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
            {t("colLeftLabel")}
          </p>
          <ComponentCard
            num="01"
            cat={t("c1Cat")}
            title={t("c1Title")}
            body={t("c1Body")}
            tag={t("c1Tag")}
          />
          <ComponentCard
            num="02"
            cat={t("c2Cat")}
            title={t("c2Title")}
            body={t("c2Body")}
            tag={t("c2Tag")}
            featured
          />
          <ComponentCard
            num="03"
            cat={t("c3Cat")}
            title={t("c3Title")}
            body={t("c3Body")}
          />
        </div>
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
            {t("colRightLabel")}
          </p>
          <ComponentCard
            num="04"
            cat={t("c4Cat")}
            title={t("c4Title")}
            bullets={[
              t("c4b1"),
              t("c4b2"),
              t("c4b3"),
              t("c4b4"),
              t("c4b5"),
            ]}
          />
          <ComponentCard
            num="05"
            cat={t("c5Cat")}
            title={t("c5Title")}
            bullets={[t("c5b1"), t("c5b2"), t("c5b3"), t("c5b4")]}
          />
          <ComponentCard
            num="06"
            cat={t("c6Cat")}
            title={t("c6Title")}
            body={t("c6Body")}
            ribbon={t("c6Ribbon")}
            featured
          />
        </div>
      </div>

      <p className="border-l-[3px] border-ochre bg-ochre/[0.08] px-3.5 py-3 font-sans text-[12px] leading-[1.55] text-ink">
        <strong className="font-medium text-ink">{t("noteTitle")}:</strong>{" "}
        {t("noteBody")}
      </p>
    </>
  );
}

function ComponentCard({
  num,
  cat,
  title,
  body,
  bullets,
  tag,
  ribbon,
  featured,
}: {
  num: string;
  cat: string;
  title: string;
  body?: string;
  bullets?: string[];
  tag?: string;
  ribbon?: string;
  featured?: boolean;
}) {
  return (
    <div
      className={`border-[1.5px] p-3.5 ${
        featured
          ? "border-green-deep bg-ochre/[0.05]"
          : "border-line bg-cream-pure"
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center bg-green-deep font-mono text-[9px] font-medium text-ochre">
          {num}
        </span>
        <span
          className={`font-mono text-[9px] uppercase tracking-[2px] ${
            featured ? "text-ochre" : "text-ink-soft"
          }`}
        >
          {cat}
        </span>
      </div>
      <h4 className="mb-1.5 font-serif text-[16px] leading-snug text-green-deep">
        {title}
      </h4>
      {body ? (
        <p className="font-sans text-[12px] leading-[1.55] text-ink-soft">
          {body}
        </p>
      ) : null}
      {bullets ? (
        <ul className="ml-1 list-none font-sans text-[12px] leading-[1.75] text-ink">
          {bullets.map((b) => (
            <li key={b}>· {b}</li>
          ))}
        </ul>
      ) : null}
      {tag ? (
        <p className="mt-2 bg-green-deep px-2 py-1.5 font-mono text-[9px] uppercase tracking-[1.5px] text-ochre">
          {tag}
        </p>
      ) : null}
      {ribbon ? (
        <p className="mt-2 border-l-[3px] border-[#5fb360] bg-[#5fb360]/[0.12] px-2 py-1.5 font-mono text-[10px] uppercase tracking-[1px] text-ink">
          {ribbon}
        </p>
      ) : null}
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span
        aria-hidden
        className="inline-block h-3 w-3 rounded-full"
        style={{ background: color }}
      />
      <span>{label}</span>
    </li>
  );
}

/* ============ SVGs ============ */

function DiagramSVG() {
  // Vista esquemática del sistema de agua integrado al mueble.
  // Colores blue/wood/sage preservados del HTML original por ser técnicos
  // del dibujo. Fuentes adaptadas a Geist Sans/Mono y tokens Campero
  // donde el color es chrome y no parte de la información del diagrama.
  return (
    <svg
      viewBox="0 0 680 420"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-auto w-full"
      aria-label="Diagrama: bidón → manguera → bomba 12V → grifo lavatorio plegable"
    >
      <defs>
        <marker id="arrow-ocre-fa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#B8763A" />
        </marker>
        <marker id="arrow-blue-fa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L0,6 L8,3 z" fill="#4a7ca8" />
        </marker>
        <pattern id="wood-fa" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#e8d4b8" />
          <line x1="0" y1="0" x2="8" y2="0" stroke="#d4c4a0" strokeWidth="0.5" />
          <line x1="0" y1="4" x2="8" y2="4" stroke="#d0be9a" strokeWidth="0.3" />
        </pattern>
        <pattern id="wood-dark-fa" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#c4956a" />
          <line x1="0" y1="0" x2="8" y2="0" stroke="#b07a50" strokeWidth="0.5" />
          <line x1="0" y1="4" x2="8" y2="4" stroke="#b87a52" strokeWidth="0.3" />
        </pattern>
      </defs>

      <rect width="680" height="420" fill="#FAF7F0" />
      <g stroke="#e8e4dc" strokeWidth="0.5" opacity="0.6">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="680" y2={40 * (i + 1)} />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`v${i}`} x1={40 * (i + 1)} y1="0" x2={40 * (i + 1)} y2="420" />
        ))}
      </g>

      {/* Mueble base */}
      <rect x="30" y="100" width="460" height="280" rx="3" fill="url(#wood-fa)" stroke="#8b5e3c" strokeWidth="2.5" />
      <rect x="210" y="100" width="12" height="280" fill="url(#wood-dark-fa)" stroke="#7a4e2c" strokeWidth="1" />
      <rect x="30" y="92" width="460" height="12" rx="2" fill="#c4956a" stroke="#8b5e3c" strokeWidth="1.5" />

      {/* Compartimento bidón */}
      <rect x="30" y="100" width="180" height="280" fill="url(#wood-fa)" stroke="none" />
      <text x="120" y="125" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fontWeight="600" fill="#8b5e3c" letterSpacing="2">COMPARTIMENTO BIDÓN</text>

      {/* Bidón */}
      <rect x="58" y="140" width="110" height="185" rx="8" fill="#b8d4e8" stroke="#4a7ca8" strokeWidth="2" />
      <rect x="88" y="134" width="50" height="14" rx="4" fill="#4a7ca8" stroke="#2d5a80" strokeWidth="1.5" />
      <path d="M88,134 Q113,120 138,134" fill="none" stroke="#4a7ca8" strokeWidth="3" strokeLinecap="round" />
      <rect x="68" y="175" width="90" height="60" rx="3" fill="white" opacity="0.7" />
      <text x="113" y="200" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="#1A1D17" fontWeight="600">10 L</text>
      <text x="113" y="214" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="8" fill="#4a7ca8" letterSpacing="1">AGUA</text>
      <rect x="58" y="230" width="110" height="95" rx="8" fill="#7fb5d4" opacity="0.4" />
      <line x1="65" y1="230" x2="160" y2="230" stroke="#4a7ca8" strokeWidth="1" strokeDasharray="4,3" />

      <rect x="100" y="322" width="26" height="14" rx="3" fill="#4a7ca8" stroke="#2d5a80" strokeWidth="1.5" />
      <path d="M113,336 L113,360 L250,360 L250,320" fill="none" stroke="#4a7ca8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrow-blue-fa)" />

      {/* Sub-compartimento bomba */}
      <rect x="222" y="112" width="140" height="90" rx="3" fill="rgba(255,255,255,0.4)" stroke="#8b5e3c" strokeWidth="1" strokeDasharray="5,3" />
      <text x="292" y="128" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fontWeight="600" fill="#8b5e3c" letterSpacing="2">BOMBA 12V</text>

      <rect x="248" y="135" width="88" height="55" rx="6" fill="#3a3a38" stroke="#1A1D17" strokeWidth="2" />
      <rect x="256" y="143" width="72" height="12" rx="3" fill="#B8763A" opacity="0.85" />
      <text x="292" y="153" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#1A1D17" fontWeight="600">BOMBA</text>
      <circle cx="290" cy="172" r="5" fill="#5fb360" />
      <text x="300" y="176" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">ON</text>
      <rect x="234" y="152" width="14" height="18" rx="3" fill="#4a7ca8" stroke="#2d5a80" strokeWidth="1" />
      <rect x="336" y="152" width="14" height="18" rx="3" fill="#B8763A" stroke="#9F632F" strokeWidth="1" />

      <path d="M400,250 L420,250 L420,162 L350,162" fill="none" stroke="#B8763A" strokeWidth="2" strokeDasharray="6,3" strokeLinecap="round" markerEnd="url(#arrow-ocre-fa)" />

      {/* EcoFlow */}
      <rect x="370" y="215" width="110" height="155" rx="4" fill="#2a2a28" stroke="#1A1D17" strokeWidth="2" />
      <rect x="378" y="225" width="94" height="40" rx="3" fill="#3a3a38" />
      <text x="425" y="240" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A" fontWeight="600">ECOFLOW</text>
      <text x="425" y="252" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#8A8A82" letterSpacing="1">ESTACIÓN ENERGÍA</text>
      <rect x="390" y="272" width="20" height="12" rx="2" fill="#B8763A" />
      <text x="400" y="281" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#1A1D17">USB</text>
      <rect x="418" y="272" width="26" height="12" rx="2" fill="#B8763A" />
      <text x="431" y="281" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#1A1D17">12V</text>
      <rect x="378" y="292" width="94" height="70" rx="3" fill="#1A1D17" />
      <rect x="385" y="299" width="80" height="56" rx="2" fill="#3a3a38" />
      <rect x="390" y="306" width="70" height="8" rx="2" fill="#1F4F38" />
      <rect x="390" y="306" width="52" height="8" rx="2" fill="#5fb360" opacity="0.85" />
      <text x="425" y="330" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#5fb360">74%</text>
      <text x="425" y="345" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">800W</text>

      {/* Sub-compartimento lavatorio */}
      <rect x="222" y="218" width="140" height="168" rx="3" fill="rgba(255,255,255,0.3)" stroke="#8b5e3c" strokeWidth="1" strokeDasharray="5,3" />
      <text x="292" y="234" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fontWeight="600" fill="#8b5e3c" letterSpacing="2">LAVATORIO PLEGABLE</text>

      <rect x="235" y="245" width="120" height="50" rx="4" fill="#c4d4e0" stroke="#4a7ca8" strokeWidth="1.5" />
      <ellipse cx="295" cy="270" rx="30" ry="18" fill="#a8c4d4" stroke="#4a7ca8" strokeWidth="1" />
      <circle cx="295" cy="270" r="5" fill="#4a7ca8" />

      <rect x="285" y="238" width="10" height="20" rx="3" fill="#888880" stroke="#606060" strokeWidth="1" />
      <rect x="275" y="230" width="30" height="10" rx="3" fill="#888880" stroke="#606060" strokeWidth="1" />
      <circle cx="290" cy="244" r="2" fill="#4a7ca8" opacity="0.8" />
      <circle cx="294" cy="248" r="1.5" fill="#4a7ca8" opacity="0.6" />
      <circle cx="291" cy="253" r="1.5" fill="#4a7ca8" opacity="0.4" />

      <path d="M350,162 L362,162 L362,230 L315,230" fill="none" stroke="#B8763A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#arrow-ocre-fa)" />

      <path d="M295,295 L295,340 L295,370" fill="none" stroke="#888880" strokeWidth="2" strokeDasharray="4,3" strokeLinecap="round" />
      <text x="305" y="362" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#8A8A82" letterSpacing="1">DESAGÜE</text>

      <rect x="240" y="196" width="104" height="6" rx="2" fill="#B8763A" opacity="0.5" />
      <text x="292" y="207" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">SOPORTE VELCRO</text>

      {/* Cotas */}
      <line x1="30" y1="400" x2="210" y2="400" stroke="#1A1D17" strokeWidth="1" />
      <line x1="30" y1="395" x2="30" y2="405" stroke="#1A1D17" strokeWidth="1" />
      <line x1="210" y1="395" x2="210" y2="405" stroke="#1A1D17" strokeWidth="1" />
      <text x="120" y="415" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17">240 mm</text>

      <line x1="506" y1="100" x2="506" y2="380" stroke="#1A1D17" strokeWidth="1" />
      <line x1="501" y1="100" x2="511" y2="100" stroke="#1A1D17" strokeWidth="1" />
      <line x1="501" y1="380" x2="511" y2="380" stroke="#1A1D17" strokeWidth="1" />
      <text x="520" y="244" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" transform="rotate(90,520,244)">ALTO MUEBLE →</text>

      {/* Números de referencia */}
      <circle cx="113" cy="148" r="11" fill="#4a7ca8" stroke="white" strokeWidth="2" />
      <text x="113" y="152" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="white" fontWeight="600">1</text>
      <circle cx="292" cy="162" r="11" fill="#1A1D17" stroke="white" strokeWidth="2" />
      <text x="292" y="166" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="#B8763A" fontWeight="600">2</text>
      <circle cx="295" cy="255" r="11" fill="#1A1D17" stroke="white" strokeWidth="2" />
      <text x="295" y="259" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="white" fontWeight="600">3</text>
      <circle cx="425" cy="260" r="11" fill="#B8763A" stroke="white" strokeWidth="2" />
      <text x="425" y="264" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="white" fontWeight="600">4</text>

      <text x="170" y="354" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#4a7ca8">→ AGUA</text>
      <text x="355" y="195" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">→ PRESIÓN</text>

      <text x="40" y="90" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#8b5e3c" letterSpacing="3">SECCIÓN BIDÓN</text>
      <text x="222" y="90" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#1A1D17" letterSpacing="3">SECCIÓN OPERACIÓN</text>

      <text x="540" y="160" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#B8763A" fontWeight="600" letterSpacing="1">ENSAMBLE</text>
      <text x="540" y="172" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#B8763A" fontWeight="600" letterSpacing="1">SIN TORNILLOS</text>

      <rect x="30" y="100" width="460" height="280" rx="3" fill="none" stroke="#1A1D17" strokeWidth="2.5" />
    </svg>
  );
}

function DimensionsSVG() {
  return (
    <svg
      viewBox="0 0 680 380"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-auto w-full"
      aria-label="Comparativa visual de compartimentos para bidones de 6L, 10L y 19L"
    >
      <rect width="680" height="380" fill="#FAF7F0" />
      <g stroke="#e8e4dc" strokeWidth="0.5" opacity="0.6">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="680" y2={40 * (i + 1)} />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`v${i}`} x1={40 * (i + 1)} y1="0" x2={40 * (i + 1)} y2="380" />
        ))}
      </g>

      <text x="340" y="30" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#8A8A82" letterSpacing="3">COMPARATIVA DE TAMAÑOS — VISTA FRONTAL COMPARTIMENTO</text>

      {/* 6L */}
      <g transform="translate(60, 50)">
        <rect x="0" y="0" width="130" height="280" rx="3" fill="rgba(184,118,58,0.08)" stroke="#B8763A" strokeWidth="2" strokeDasharray="6,3" />
        <rect x="20" y="40" width="90" height="190" rx="8" fill="#b8d4e8" stroke="#4a7ca8" strokeWidth="2" />
        <rect x="40" y="33" width="50" height="14" rx="4" fill="#4a7ca8" stroke="#2d5a80" strokeWidth="1.5" />
        <path d="M40,33 Q65,20 90,33" fill="none" stroke="#4a7ca8" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="28" y="90" width="74" height="50" rx="2" fill="white" opacity="0.85" />
        <text x="65" y="112" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="11" fill="#1A1D17" fontWeight="600">6 L</text>
        <text x="65" y="128" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#4a7ca8" letterSpacing="1">AGUA</text>
        <line x1="115" y1="40" x2="125" y2="40" stroke="#8A8A82" strokeWidth="1" />
        <line x1="115" y1="230" x2="125" y2="230" stroke="#8A8A82" strokeWidth="1" />
        <line x1="120" y1="40" x2="120" y2="230" stroke="#8A8A82" strokeWidth="1" />
        <text x="127" y="140" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" transform="rotate(90,127,140)">190mm</text>
        <line x1="20" y1="240" x2="110" y2="240" stroke="#8A8A82" strokeWidth="1" />
        <line x1="20" y1="236" x2="20" y2="244" stroke="#8A8A82" strokeWidth="1" />
        <line x1="110" y1="236" x2="110" y2="244" stroke="#8A8A82" strokeWidth="1" />
        <text x="65" y="252" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17">120mm</text>
        <text x="65" y="268" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#8A8A82">PROF. 150mm</text>
        <rect x="0" y="0" width="130" height="28" rx="3" fill="#B8763A" />
        <text x="65" y="18" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="white" letterSpacing="2">BIDÓN 6L</text>
      </g>

      {/* 10L */}
      <g transform="translate(260, 50)">
        <rect x="0" y="0" width="155" height="280" rx="3" fill="rgba(74,124,168,0.10)" stroke="#4a7ca8" strokeWidth="2.5" />
        <rect x="15" y="-12" width="125" height="22" rx="3" fill="#04342C" />
        <text x="77" y="3" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#B8763A" letterSpacing="2">RECOMENDADO</text>
        <rect x="22" y="40" width="111" height="200" rx="8" fill="#9ec4dc" stroke="#4a7ca8" strokeWidth="2.5" />
        <rect x="47" y="33" width="61" height="14" rx="4" fill="#4a7ca8" stroke="#2d5a80" strokeWidth="1.5" />
        <path d="M47,33 Q77,18 107,33" fill="none" stroke="#4a7ca8" strokeWidth="3" strokeLinecap="round" />
        <rect x="32" y="95" width="91" height="50" rx="2" fill="white" opacity="0.85" />
        <text x="77" y="117" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="14" fill="#1A1D17" fontWeight="600">10 L</text>
        <text x="77" y="133" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#4a7ca8" letterSpacing="1">AGUA</text>
        <line x1="138" y1="40" x2="148" y2="40" stroke="#8A8A82" strokeWidth="1" />
        <line x1="138" y1="240" x2="148" y2="240" stroke="#8A8A82" strokeWidth="1" />
        <line x1="143" y1="40" x2="143" y2="240" stroke="#8A8A82" strokeWidth="1" />
        <text x="150" y="145" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" transform="rotate(90,150,145)">200mm</text>
        <line x1="22" y1="250" x2="133" y2="250" stroke="#8A8A82" strokeWidth="1" />
        <line x1="22" y1="246" x2="22" y2="254" stroke="#8A8A82" strokeWidth="1" />
        <line x1="133" y1="246" x2="133" y2="254" stroke="#8A8A82" strokeWidth="1" />
        <text x="77" y="263" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17">145mm</text>
        <text x="77" y="275" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#8A8A82">PROF. 175mm</text>
        <rect x="0" y="0" width="155" height="28" rx="3" fill="#4a7ca8" />
        <text x="77" y="18" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="white" letterSpacing="2">BIDÓN 10L</text>
      </g>

      {/* 19L */}
      <g transform="translate(490, 50)">
        <rect x="0" y="0" width="165" height="280" rx="3" fill="rgba(31,79,56,0.08)" stroke="#1F4F38" strokeWidth="2" strokeDasharray="6,3" />
        <rect x="18" y="32" width="129" height="218" rx="10" fill="#b0cca0" stroke="#1F4F38" strokeWidth="2" />
        <rect x="55" y="24" width="55" height="16" rx="5" fill="#1F4F38" stroke="#0F4632" strokeWidth="1.5" />
        <path d="M55,24 Q82,10 110,24" fill="none" stroke="#1F4F38" strokeWidth="3" strokeLinecap="round" />
        <rect x="28" y="100" width="109" height="55" rx="2" fill="white" opacity="0.85" />
        <text x="82" y="122" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="14" fill="#1A1D17" fontWeight="600">19 L</text>
        <text x="82" y="143" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#1F4F38" letterSpacing="1">GARRAFÓN</text>
        <rect x="18" y="175" width="129" height="28" rx="3" fill="rgba(168,75,42,0.15)" />
        <text x="82" y="193" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#a84b2a">~19 KG CARGADO</text>
        <line x1="152" y1="32" x2="162" y2="32" stroke="#8A8A82" strokeWidth="1" />
        <line x1="152" y1="250" x2="162" y2="250" stroke="#8A8A82" strokeWidth="1" />
        <line x1="157" y1="32" x2="157" y2="250" stroke="#8A8A82" strokeWidth="1" />
        <text x="164" y="146" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" transform="rotate(90,164,146)">260mm</text>
        <line x1="18" y1="258" x2="147" y2="258" stroke="#8A8A82" strokeWidth="1" />
        <line x1="18" y1="254" x2="18" y2="262" stroke="#8A8A82" strokeWidth="1" />
        <line x1="147" y1="254" x2="147" y2="262" stroke="#8A8A82" strokeWidth="1" />
        <text x="82" y="270" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17">170mm</text>
        <text x="82" y="278" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#8A8A82">PROF. 195mm</text>
        <rect x="0" y="0" width="165" height="28" rx="3" fill="#1F4F38" />
        <text x="82" y="18" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="white" letterSpacing="2">BIDÓN 19L</text>
      </g>
    </svg>
  );
}
