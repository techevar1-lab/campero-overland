"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import accesoriosData from "@data/accesorios.json";
import { formatPrice, type Price } from "@/lib/format";

type Tab = "diagram" | "dimensions" | "components";

function getWaterPrice(): Price | null {
  const group = (
    accesoriosData as {
      groups: { id: string; variants: { price: Price }[] }[];
    }
  ).groups.find((g) => g.id === "water");
  return group?.variants[0]?.price ?? null;
}

export function FichaAgua() {
  const t = useTranslations("FichaAgua");
  const [tab, setTab] = useState<Tab>("diagram");
  const price = getWaterPrice();

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
          {/* DIMENSIONS TABLE */}
          <section>
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
              {t("sidebar.dimsLabel")}
            </p>
            <dl className="grid grid-cols-2 gap-y-2">
              <DimRow
                label={t("sidebar.anchoInterior")}
                value={t("sidebar.anchoInteriorValue")}
                highlight
              />
              <DimRow
                label={t("sidebar.profundidad")}
                value={t("sidebar.profundidadValue")}
              />
              <DimRow
                label={t("sidebar.altoLibre")}
                value={t("sidebar.altoLibreValue")}
              />
              <DimRow
                label={t("sidebar.holguraLateral")}
                value={t("sidebar.holguraLateralValue")}
              />
              <DimRow
                label={t("sidebar.holguraSuperior")}
                value={t("sidebar.holguraSuperiorValue")}
              />
              <DimRow
                label={t("sidebar.espesorPared")}
                value={t("sidebar.espesorParedValue")}
              />
              <DimRow
                label={t("sidebar.pesoLleno")}
                value={t("sidebar.pesoLlenoValue")}
              />
            </dl>
          </section>

          {/* SPECS */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
              {t("sidebar.specsLabel")}
            </p>
            <ul className="bg-green-deep p-3.5 font-mono text-[10px] leading-relaxed text-cream/85">
              <SpecRow
                k={t("sidebar.specs.capacityKey")}
                v={t("sidebar.specs.capacityValue")}
              />
              <SpecRow
                k={t("sidebar.specs.pumpKey")}
                v={t("sidebar.specs.pumpValue")}
              />
              <SpecRow
                k={t("sidebar.specs.hoseKey")}
                v={t("sidebar.specs.hoseValue")}
              />
              <SpecRow
                k={t("sidebar.specs.usesKey")}
                v={t("sidebar.specs.usesValue")}
              />
              <SpecRow
                k={t("sidebar.specs.chargeKey")}
                v={t("sidebar.specs.chargeValue")}
              />
              <SpecRow
                k={t("sidebar.specs.materialKey")}
                v={t("sidebar.specs.materialValue")}
              />
              <SpecRow
                k={t("sidebar.specs.mountKey")}
                v={t("sidebar.specs.mountValue")}
              />
            </ul>
          </section>

          {/* PRECIO */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">
              {t("sidebar.pricesLabel")}
            </p>
            <div className="flex items-center justify-between gap-3 py-2">
              <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-ink">
                {t("sidebar.priceRowLabel")}
              </span>
              {price ? (
                <span className="font-mono text-[13px] font-medium text-ochre">
                  {formatPrice(price)}
                </span>
              ) : null}
            </div>
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
        <LegendItem color="#B8763A" label={t("legend.pump")} />
        <LegendItem color="#5fb360" label={t("legend.hose")} />
        <LegendItem color="#c4956a" label={t("legend.wood")} />
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
            bullets={[t("c4b1"), t("c4b2"), t("c4b3"), t("c4b4")]}
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
  featured,
}: {
  num: string;
  cat: string;
  title: string;
  body?: string;
  bullets?: string[];
  tag?: string;
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
  // Vista esquemática del Water tank San Hima 24 L apoyado en el
  // compartimento de agua del Campero. Producto autónomo: bomba con
  // batería 12V integrada + manguera de 6 m con cabezal de 10 modos.
  // Colores técnicos del dibujo: azul agua, ocre energía, verde flujo,
  // madera del mueble.
  return (
    <svg
      viewBox="0 0 680 420"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-auto w-full"
      aria-label="Diagrama: estanque 24 L con bomba a batería 12V, manguera de 6 m y cabezal de 10 modos de rociado"
    >
      <rect width="680" height="420" fill="#FAF7F0" />
      <g stroke="#e8e4dc" strokeWidth="0.5" opacity="0.55">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="680" y2={40 * (i + 1)} />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`v${i}`} x1={40 * (i + 1)} y1="0" x2={40 * (i + 1)} y2="420" />
        ))}
      </g>

      {/* Compartimento de madera */}
      <rect x="40" y="120" width="360" height="260" rx="4" fill="#e8d4b8" stroke="#8b5e3c" strokeWidth="2.5" />
      <rect x="40" y="112" width="360" height="14" rx="2" fill="#c4956a" stroke="#8b5e3c" strokeWidth="1.5" />
      <text x="220" y="106" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fontWeight="600" fill="#8b5e3c" letterSpacing="2">COMPARTIMENTO DE AGUA</text>

      {/* Estanque 24 L */}
      <rect x="80" y="196" width="210" height="156" rx="10" fill="#9ec4dc" stroke="#4a7ca8" strokeWidth="2.5" />
      <rect x="150" y="188" width="70" height="16" rx="4" fill="#4a7ca8" stroke="#2d5a80" strokeWidth="1.5" />
      <rect x="110" y="244" width="150" height="58" rx="3" fill="white" opacity="0.8" />
      <text x="185" y="280" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="22" fill="#1A1D17" fontWeight="600">24 L</text>
      <text x="185" y="296" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="8" fill="#4a7ca8" letterSpacing="1">AGUA · PE SIN BPA</text>

      {/* Bomba a batería 12V */}
      <rect x="95" y="150" width="180" height="42" rx="4" fill="#2a2a28" stroke="#1A1D17" strokeWidth="2" />
      <text x="132" y="167" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#B8763A" fontWeight="600">BOMBA 12V</text>
      <rect x="180" y="159" width="82" height="13" rx="2" fill="#1A1D17" />
      <rect x="182" y="161" width="58" height="9" rx="1" fill="#5fb360" />
      <text x="221" y="186" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">BATERÍA RECARGABLE</text>

      {/* Manguera 6 m + cabezal */}
      <path d="M275,168 C360,158 385,150 432,150 C474,150 474,202 442,212 C420,219 432,236 456,240" fill="none" stroke="#5fb360" strokeWidth="4" strokeLinecap="round" />
      <text x="350" y="134" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">MANGUERA 6 m →</text>

      {/* Cabezal */}
      <rect x="450" y="232" width="42" height="22" rx="4" fill="#3a3a38" stroke="#1A1D17" strokeWidth="1.5" />
      <text x="471" y="247" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#B8763A" fontWeight="600">CABEZAL</text>
      <circle cx="471" cy="270" r="3" fill="#4a7ca8" opacity="0.85" />
      <circle cx="480" cy="280" r="2.5" fill="#4a7ca8" opacity="0.6" />
      <circle cx="463" cy="282" r="2" fill="#4a7ca8" opacity="0.5" />
      <text x="471" y="304" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fontWeight="600" fill="#5fb360" letterSpacing="1">10 MODOS</text>

      {/* Etiqueta producto + ribbon */}
      <text x="520" y="120" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="11" fontWeight="600" fill="#1A1D17" letterSpacing="1">SAN HIMA 24 L</text>
      <rect x="455" y="130" width="130" height="22" rx="3" fill="#04342C" />
      <text x="520" y="145" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#B8763A" letterSpacing="2">PLUG &amp; PLAY</text>

      {/* Cota alto del mueble */}
      <line x1="416" y1="120" x2="416" y2="380" stroke="#1A1D17" strokeWidth="1" />
      <line x1="411" y1="120" x2="421" y2="120" stroke="#1A1D17" strokeWidth="1" />
      <line x1="411" y1="380" x2="421" y2="380" stroke="#1A1D17" strokeWidth="1" />
      <text x="430" y="350" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" transform="rotate(90,430,350)">ALTO MUEBLE →</text>

      <rect x="40" y="120" width="360" height="260" rx="4" fill="none" stroke="#1A1D17" strokeWidth="2.5" />
    </svg>
  );
}

function DimensionsSVG() {
  return (
    <svg
      viewBox="0 0 680 360"
      xmlns="http://www.w3.org/2000/svg"
      className="block h-auto w-full"
      aria-label="Vista frontal del compartimento de agua para el Water tank de 24 L"
    >
      <rect width="680" height="360" fill="#FAF7F0" />
      <g stroke="#e8e4dc" strokeWidth="0.5" opacity="0.55">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="680" y2={40 * (i + 1)} />
        ))}
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`v${i}`} x1={40 * (i + 1)} y1="0" x2={40 * (i + 1)} y2="360" />
        ))}
      </g>

      <text x="340" y="30" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#8A8A82" letterSpacing="3">VISTA FRONTAL — COMPARTIMENTO DE AGUA</text>

      <g transform="translate(250, 55)">
        {/* Compartimento */}
        <rect x="0" y="0" width="180" height="260" rx="4" fill="rgba(74,124,168,0.10)" stroke="#4a7ca8" strokeWidth="2.5" />
        <rect x="0" y="0" width="180" height="28" rx="3" fill="#4a7ca8" />
        <text x="90" y="18" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="white" letterSpacing="2">WATER TANK 24 L</text>

        {/* Estanque */}
        <rect x="30" y="58" width="120" height="178" rx="10" fill="#9ec4dc" stroke="#4a7ca8" strokeWidth="2.5" />
        <rect x="62" y="50" width="56" height="14" rx="4" fill="#4a7ca8" stroke="#2d5a80" strokeWidth="1.5" />
        <path d="M62,50 Q90,36 118,50" fill="none" stroke="#4a7ca8" strokeWidth="3" strokeLinecap="round" />
        <rect x="42" y="112" width="96" height="50" rx="3" fill="white" opacity="0.85" />
        <text x="90" y="142" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="16" fill="#1A1D17" fontWeight="600">24 L</text>
        <text x="90" y="158" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="8" fill="#4a7ca8" letterSpacing="1">AGUA</text>

        {/* Cota alto */}
        <line x1="158" y1="58" x2="168" y2="58" stroke="#8A8A82" strokeWidth="1" />
        <line x1="158" y1="236" x2="168" y2="236" stroke="#8A8A82" strokeWidth="1" />
        <line x1="163" y1="58" x2="163" y2="236" stroke="#8A8A82" strokeWidth="1" />
        <text x="171" y="150" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" transform="rotate(90,171,150)">420 mm</text>

        {/* Cota ancho */}
        <line x1="30" y1="246" x2="150" y2="246" stroke="#8A8A82" strokeWidth="1" />
        <line x1="30" y1="242" x2="30" y2="250" stroke="#8A8A82" strokeWidth="1" />
        <line x1="150" y1="242" x2="150" y2="250" stroke="#8A8A82" strokeWidth="1" />
        <text x="90" y="259" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17">360 mm</text>
        <text x="90" y="273" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#8A8A82">PROF. 290 mm</text>
      </g>

      {/* Nota holgura */}
      <text x="500" y="150" fontFamily="var(--font-geist-sans), sans-serif" fontSize="11" fontWeight="600" fill="#B8763A" letterSpacing="1">HOLGURA</text>
      <text x="500" y="168" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17">+20 mm c/lado</text>
      <text x="500" y="182" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17">+30 mm superior</text>
      <text x="500" y="210" fontFamily="var(--font-geist-sans), sans-serif" fontSize="11" fontWeight="600" fill="#1A1D17" letterSpacing="1">SIN TORNILLOS</text>
      <text x="500" y="228" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#8A8A82">APOYO DIRECTO</text>
    </svg>
  );
}
