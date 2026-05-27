"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import accesoriosData from "@data/accesorios.json";
import { formatPrice, type Price } from "@/lib/format";

type Model = "r3" | "r3p" | "r2p";
type Tab = "diagram" | "compare" | "autonomy";

const SPEC_DATA: Record<
  Model,
  {
    cap: string;
    pot: string;
    boost: string;
    l: string;
    a: string;
    h: string;
    p: string;
    n: string;
    ac: string;
    exp: string;
    ip: string;
    cert: string;
    cl: string;
    ca: string;
    ch: string;
  }
> = {
  r3: {
    cap: "256 Wh",
    pot: "300 W",
    boost: "600 W",
    l: "255 mm",
    a: "212 mm",
    h: "113 mm",
    p: "3.55 kg",
    n: "30 dB",
    ac: "1× 220V",
    exp: "No",
    ip: "IP54 / 1 m",
    cert: "—",
    cl: "295 mm",
    ca: "272 mm",
    ch: "173 mm",
  },
  r3p: {
    cap: "286 Wh",
    pot: "600 W",
    boost: "1200 W",
    l: "234 mm",
    a: "232 mm",
    h: "146 mm",
    p: "4.7 kg",
    n: "30 dB",
    ac: "3× 220V",
    exp: "Sí (+EB300/600)",
    ip: "IP54 / 1 m",
    cert: "—",
    cl: "274 mm",
    ca: "292 mm",
    ch: "206 mm",
  },
  r2p: {
    cap: "768 Wh",
    pot: "800 W",
    boost: "1600 W",
    l: "270 mm",
    a: "260 mm",
    h: "226 mm",
    p: "7.8 kg",
    n: "—",
    ac: "3× 220V",
    exp: "No",
    ip: "— / —",
    cert: "TÜV Rheinland",
    cl: "310 mm",
    ca: "320 mm",
    ch: "286 mm",
  },
};

function getPowerPrices(): { id: Model; price: Price }[] {
  const group = (accesoriosData as { groups: { id: string; variants: { id: string; price: Price }[] }[] }).groups.find(
    (g) => g.id === "power",
  );
  if (!group) return [];
  const map: Record<string, Model> = {
    power_300: "r3",
    power_600: "r3p",
    power_800: "r2p",
  };
  return group.variants
    .map((v) => ({ id: map[v.id], price: v.price }))
    .filter((p): p is { id: Model; price: Price } => Boolean(p.id));
}

export function FichaEnergia() {
  const t = useTranslations("FichaEnergia");
  const [tab, setTab] = useState<Tab>("diagram");
  const [model, setModel] = useState<Model>("r3p");
  const spec = SPEC_DATA[model];
  const prices = getPowerPrices();

  return (
    <article className="font-sans text-ink">
      <header className="grid grid-cols-1 items-center gap-2 border-b-2 border-green-deep bg-green-deep px-6 py-4 text-cream sm:grid-cols-3 sm:gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[2px] text-ochre">{t("brand")}</p>
          <p className="font-mono text-[10px] uppercase tracking-[2px] text-cream/55">{t("location")}</p>
        </div>
        <div className="text-left sm:text-center">
          <h2 className="font-serif text-2xl leading-none tracking-[-0.5px] text-cream">{t("title")}</h2>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[2px] text-cream/60">{t("subtitle")}</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-mono text-[10px] uppercase tracking-[2px] text-cream/55">{t("docTag")}</p>
          <p className="font-mono text-[10px] uppercase tracking-[2px] text-cream/55">{t("rev")}</p>
        </div>
      </header>

      <div role="tablist" aria-label={t("tabsAriaLabel")} className="flex flex-wrap border-b-2 border-green-deep bg-cream">
        {(["diagram", "compare", "autonomy"] as Tab[]).map((id, i) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`ficha-energia-panel-${id}`}
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        <section
          id={`ficha-energia-panel-${tab}`}
          role="tabpanel"
          className="flex flex-col gap-6 border-b border-green-deep/15 p-6 lg:border-b-0 lg:border-r-2 lg:border-r-green-deep lg:p-8"
        >
          {tab === "diagram" ? <DiagramTab /> : null}
          {tab === "compare" ? <CompareTab /> : null}
          {tab === "autonomy" ? <AutonomyTab /> : null}
        </section>

        <aside className="flex flex-col gap-6 p-6">
          {/* Model selector */}
          <section>
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">{t("sidebar.modelLabel")}</p>
            <div className="flex gap-2">
              {(["r3", "r3p", "r2p"] as Model[]).map((m) => {
                const active = model === m;
                const label = m === "r3" ? "R3" : m === "r3p" ? "R3+" : "R2P";
                const sub = m === "r3" ? "256 Wh" : m === "r3p" ? "286 Wh" : "768 Wh";
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModel(m)}
                    className={`flex flex-1 flex-col items-center gap-0.5 border-[1.5px] px-2 py-2.5 transition-colors ${
                      active ? "border-green-deep bg-green-deep text-ochre" : "border-line text-ink hover:border-green-deep"
                    }`}
                  >
                    <span className="font-serif text-base leading-none">{label}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[1.5px] opacity-70">{sub}</span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Specs */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">{t("sidebar.specsLabel")}</p>
            <dl className="grid grid-cols-2 gap-y-2">
              <DimRow label={t("sidebar.capacity")} value={spec.cap} highlight />
              <DimRow label={t("sidebar.power")} value={spec.pot} />
              <DimRow label={t("sidebar.boost")} value={spec.boost} />
              <DimRow label={t("sidebar.length")} value={spec.l} />
              <DimRow label={t("sidebar.width")} value={spec.a} />
              <DimRow label={t("sidebar.height")} value={spec.h} />
              <DimRow label={t("sidebar.weight")} value={spec.p} />
              <DimRow label={t("sidebar.noise")} value={spec.n} />
              <DimRow label={t("sidebar.acOut")} value={spec.ac} />
              <DimRow label={t("sidebar.expandable")} value={spec.exp} />
              <DimRow label={t("sidebar.ip")} value={spec.ip} />
              <DimRow label={t("sidebar.cert")} value={spec.cert} />
            </dl>
          </section>

          {/* Compartimento */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">{t("sidebar.compartLabel")}</p>
            <ul className="bg-green-deep p-3.5 font-mono text-[10px] leading-relaxed text-cream/85">
              <SpecRow k={t("sidebar.cLength")} v={spec.cl} />
              <SpecRow k={t("sidebar.cDepth")} v={spec.ca} />
              <SpecRow k={t("sidebar.cHeight")} v={spec.ch} />
              <SpecRow k={t("sidebar.cClearance")} v={t("sidebar.cClearanceValue")} />
              <SpecRow k={t("sidebar.cVent")} v={t("sidebar.cVentValue")} />
            </ul>
          </section>

          {/* Precios */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">{t("sidebar.pricesLabel")}</p>
            <ul className="flex flex-col">
              {prices.map((p, i) => (
                <li
                  key={p.id}
                  className={`flex items-center justify-between gap-3 py-2 ${
                    i < prices.length - 1 ? "border-b border-line" : ""
                  }`}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[1.5px] text-ink">
                    {p.id === "r3" ? t("sidebar.priceR3") : p.id === "r3p" ? t("sidebar.priceR3p") : t("sidebar.priceR2p")}
                  </span>
                  <span className="font-mono text-[11px] font-medium text-ochre">{formatPrice(p.price)}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ¿Cuál elegir? */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">{t("sidebar.chooseLabel")}</p>
            <div className="space-y-2 font-sans text-[12px] leading-relaxed text-ink">
              <p className="border-l-[3px] border-[#3a7fc1] bg-[#3a7fc1]/[0.08] px-3 py-2">
                <strong className="font-medium">River 3</strong> — {t("sidebar.r3Body")}
              </p>
              <p className="border-l-[3px] border-ochre bg-ochre/[0.08] px-3 py-2">
                <strong className="font-medium">River 3 Plus</strong> — {t("sidebar.r3pBody")}
              </p>
              <p className="border-l-[3px] border-[#7c3ac1] bg-[#7c3ac1]/[0.08] px-3 py-2">
                <strong className="font-medium">River 2 Pro</strong> — {t("sidebar.r2pBody")}
              </p>
            </div>
          </section>

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

/* ============ HELPERS ============ */

function DimRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <>
      <dt className="font-mono text-[10px] uppercase tracking-[1.5px] text-ink-soft">{label}</dt>
      <dd className={`text-right font-mono ${highlight ? "text-[14px] font-medium text-ochre" : "text-[12px] text-ink"}`}>
        {value}
      </dd>
    </>
  );
}

function SpecRow({ k, v }: { k: string; v: string }) {
  return (
    <li className="flex gap-2">
      <span className="w-24 shrink-0 text-[#7ab4e8]">{k}</span>
      <span>{v}</span>
    </li>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span aria-hidden className="inline-block h-3 w-3 rounded-full" style={{ background: color }} />
      <span>{label}</span>
    </li>
  );
}

function TabHeader({ label, titleParts }: { label: string; titleParts: { plain: string; em: string } }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">{label}</p>
      <h3 className="font-serif text-[28px] leading-tight tracking-[-0.5px] text-green-deep">
        {titleParts.plain} <em className="italic text-ochre">{titleParts.em}</em>
      </h3>
    </div>
  );
}

/* ============ TABS ============ */

function DiagramTab() {
  const t = useTranslations("FichaEnergia.diagram");
  return (
    <>
      <TabHeader label={t("label")} titleParts={{ plain: t("titlePlain"), em: t("titleEm") }} />
      <div className="border border-green-deep/15 bg-cream-pure p-4">
        <DiagramSVG />
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[1.5px] text-ink">
        <LegendItem color="#8A8A82" label={t("legend.dc12")} />
        <LegendItem color="#B8763A" label={t("legend.usbA")} />
        <LegendItem color="#f5c842" label={t("legend.solarUsbC")} />
        <LegendItem color="#7c3ac1" label={t("legend.ac220")} />
        <LegendItem color="#5fb360" label={t("legend.active")} />
      </ul>
      <p className="border-l-[3px] border-ochre bg-ochre/[0.08] px-3.5 py-3 font-sans text-[12px] leading-[1.55] text-ink">
        <strong className="font-medium text-ink">{t("noteTitle")}:</strong> {t("noteBody")}
      </p>
    </>
  );
}

function CompareTab() {
  const t = useTranslations("FichaEnergia.compare");
  return (
    <>
      <TabHeader label={t("label")} titleParts={{ plain: t("titlePlain"), em: t("titleEm") }} />
      <div className="border border-green-deep/15 bg-cream-pure p-4">
        <CompareSVG />
      </div>
      <p className="border-l-[3px] border-ochre bg-ochre/[0.08] px-3.5 py-3 font-sans text-[12px] leading-[1.55] text-ink">
        <strong className="font-medium text-ink">{t("noteTitle")}:</strong> {t("noteBody")}
      </p>
    </>
  );
}

function AutonomyTab() {
  const t = useTranslations("FichaEnergia.autonomy");
  return (
    <>
      <TabHeader label={t("label")} titleParts={{ plain: t("titlePlain"), em: t("titleEm") }} />
      <div className="border border-green-deep/15 bg-cream-pure p-4">
        <AutonomySVG />
      </div>
      <p className="border-l-[3px] border-[#5fb360] bg-[#5fb360]/[0.08] px-3.5 py-3 font-sans text-[12px] leading-[1.55] text-ink">
        <strong className="font-medium text-ink">{t("noteTitle")}:</strong> {t("noteBody")}
      </p>
    </>
  );
}

/* ============ SVGs ============ */

function DiagramSVG() {
  return (
    <svg viewBox="0 0 700 430" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full" aria-label="Diagrama: EcoFlow alimenta cooler, bomba de agua, luces LED y dispositivos AC. Entradas: solar y 12V auto">
      <defs>
        <marker id="ae-blk" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L0,6L8,3z" fill="#1A1D17" /></marker>
        <marker id="ae-ocre" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L0,6L8,3z" fill="#B8763A" /></marker>
        <marker id="ae-sol" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0L0,6L8,3z" fill="#f5c842" /></marker>
        <pattern id="wood-e" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#e8d4b8" />
          <line x1="0" y1="0" x2="8" y2="0" stroke="#d4c4a0" strokeWidth="0.5" />
          <line x1="0" y1="4" x2="8" y2="4" stroke="#d0be9a" strokeWidth="0.3" />
        </pattern>
        <pattern id="wood-d-e" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#c4956a" />
          <line x1="0" y1="0" x2="8" y2="0" stroke="#b07a50" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="efGrad-e" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3a38" />
          <stop offset="100%" stopColor="#1A1D17" />
        </linearGradient>
      </defs>

      <rect width="700" height="430" fill="#FAF7F0" />
      <g stroke="#e8e4dc" strokeWidth="0.5" opacity="0.5">
        {Array.from({ length: 10 }).map((_, i) => <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="700" y2={40 * (i + 1)} />)}
        {Array.from({ length: 17 }).map((_, i) => <line key={`v${i}`} x1={40 * (i + 1)} y1="0" x2={40 * (i + 1)} y2="430" />)}
      </g>

      {/* Mueble */}
      <rect x="28" y="90" width="530" height="295" rx="3" fill="url(#wood-e)" stroke="#8b5e3c" strokeWidth="2.5" />
      <rect x="28" y="82" width="530" height="12" rx="2" fill="#c4956a" stroke="#8b5e3c" strokeWidth="1.5" />
      <rect x="220" y="90" width="12" height="295" fill="url(#wood-d-e)" stroke="#7a4e2c" strokeWidth="1" />
      <text x="32" y="79" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#8b5e3c" letterSpacing="3">SECCIÓN ENERGÍA</text>
      <text x="238" y="79" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#8b5e3c" letterSpacing="3">SECCIÓN CONSUMIDORES</text>

      {/* Corral EcoFlow */}
      <rect x="38" y="100" width="172" height="268" rx="3" fill="rgba(184,118,58,0.06)" stroke="#B8763A" strokeWidth="1" strokeDasharray="5,3" />

      {/* EcoFlow body */}
      <rect x="50" y="115" width="148" height="238" rx="8" fill="url(#efGrad-e)" stroke="#1A1D17" strokeWidth="2.5" />
      <rect x="58" y="123" width="132" height="36" rx="5" fill="#111110" />
      <text x="124" y="135" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A" fontWeight="600">ECOFLOW</text>
      <text x="124" y="148" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">RIVER 3 PLUS</text>
      <rect x="60" y="165" width="128" height="14" rx="3" fill="#1F4F38" />
      <rect x="60" y="165" width="96" height="14" rx="3" fill="#5fb360" opacity="0.85" />
      <text x="196" y="176" textAnchor="end" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">75%</text>
      <text x="124" y="194" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#8A8A82" letterSpacing="1">286 Wh</text>

      {/* Puertos salida */}
      <rect x="60" y="205" width="30" height="14" rx="2" fill="#B8763A" />
      <text x="75" y="215" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6" fill="#1A1D17" fontWeight="600">USB-A</text>
      <rect x="96" y="205" width="30" height="14" rx="2" fill="#B8763A" />
      <text x="111" y="215" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6" fill="#1A1D17" fontWeight="600">USB-A</text>
      <rect x="132" y="205" width="30" height="14" rx="2" fill="#B8763A" />
      <text x="147" y="215" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6" fill="#1A1D17" fontWeight="600">USB-C</text>
      <rect x="60" y="225" width="40" height="14" rx="2" fill="#8A8A82" />
      <text x="80" y="235" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6" fill="white">12V DC</text>
      <rect x="108" y="225" width="40" height="14" rx="2" fill="#7c3ac1" />
      <text x="128" y="235" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6" fill="white">220V AC</text>

      {/* Entradas */}
      <rect x="58" y="300" width="132" height="40" rx="5" fill="#111110" />
      <text x="124" y="313" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">ENTRADAS</text>
      <rect x="64" y="318" width="28" height="14" rx="2" fill="#f5c842" />
      <text x="78" y="328" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6" fill="#1A1D17" fontWeight="600">SOLAR</text>
      <rect x="98" y="318" width="26" height="14" rx="2" fill="#8A8A82" />
      <text x="111" y="328" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6" fill="white">12V IN</text>
      <rect x="130" y="318" width="28" height="14" rx="2" fill="#7c3ac1" />
      <text x="144" y="328" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6" fill="white">CA IN</text>

      <rect x="58" y="345" width="132" height="22" rx="3" fill="#2a2a28" />
      <text x="124" y="360" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">234×232×146 mm · 4.7 kg</text>

      <circle cx="64" cy="123" r="11" fill="#B8763A" stroke="white" strokeWidth="2" />
      <text x="64" y="127" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="white" fontWeight="600">1</text>

      {/* Consumidores: cooler */}
      <rect x="238" y="108" width="152" height="120" rx="5" fill="#2a2a28" stroke="#1A1D17" strokeWidth="1.5" />
      <rect x="246" y="116" width="136" height="22" rx="3" fill="#111110" />
      <text x="314" y="130" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#B8763A">ALPICOOL</text>
      <rect x="252" y="146" width="124" height="70" rx="4" fill="#b8d8ec" stroke="#3a7fc1" strokeWidth="1.5" />
      <text x="314" y="188" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="#1A1D17" fontWeight="600">X18 / X30</text>
      <circle cx="372" cy="122" r="8" fill="#B8763A" stroke="#9F632F" strokeWidth="1.5" />
      <path d="M108,225 L108,250 L238,250 L238,170" fill="none" stroke="#8A8A82" strokeWidth="2.5" strokeDasharray="6,3" strokeLinecap="round" markerEnd="url(#ae-blk)" />
      <text x="175" y="248" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">12V DC</text>
      <circle cx="248" cy="120" r="11" fill="#3a7fc1" stroke="white" strokeWidth="2" />
      <text x="248" y="124" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="white" fontWeight="600">2</text>

      {/* Bomba */}
      <rect x="238" y="248" width="100" height="52" rx="5" fill="#3a3a38" stroke="#1A1D17" strokeWidth="1.5" />
      <rect x="246" y="256" width="84" height="12" rx="2" fill="#B8763A" opacity="0.85" />
      <text x="288" y="265" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#1A1D17" fontWeight="600">BOMBA</text>
      <circle cx="276" cy="285" r="5" fill="#5fb360" />
      <text x="284" y="289" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#5fb360">ON</text>
      <path d="M96,205 L96,195 L238,195 L238,270" fill="none" stroke="#B8763A" strokeWidth="2" strokeDasharray="5,3" strokeLinecap="round" markerEnd="url(#ae-ocre)" />
      <text x="166" y="193" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#B8763A">USB-A</text>
      <circle cx="248" cy="252" r="11" fill="#B8763A" stroke="white" strokeWidth="2" />
      <text x="248" y="256" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="white" fontWeight="600">3</text>

      {/* Luces LED */}
      <rect x="355" y="248" width="128" height="52" rx="5" fill="#111110" stroke="#1A1D17" strokeWidth="1.5" />
      <rect x="363" y="256" width="50" height="12" rx="2" fill="#f5c842" opacity="0.85" />
      <text x="388" y="265" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#1A1D17" fontWeight="600">LED</text>
      <circle cx="398" cy="285" r="5" fill="#f5c842" />
      <path d="M147,205 L147,195 L419,195 L419,248" fill="none" stroke="#f5c842" strokeWidth="2" strokeDasharray="5,3" strokeLinecap="round" markerEnd="url(#ae-sol)" />
      <text x="285" y="193" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#f5c842">USB-C</text>
      <circle cx="365" cy="252" r="11" fill="#111110" stroke="#f5c842" strokeWidth="2" />
      <text x="365" y="256" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#f5c842" fontWeight="600">4</text>

      {/* AC dispositivos */}
      <rect x="355" y="320" width="128" height="52" rx="5" fill="#2a2a28" stroke="#7c3ac1" strokeWidth="1.5" />
      <rect x="363" y="328" width="84" height="12" rx="2" fill="#7c3ac1" opacity="0.9" />
      <text x="405" y="337" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="white" fontWeight="600">220V AC</text>
      <text x="419" y="362" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#8A8A82">Laptop · Cargadores</text>
      <path d="M128,225 L128,240 L480,240 L480,320" fill="none" stroke="#7c3ac1" strokeWidth="2.5" strokeDasharray="6,3" strokeLinecap="round" markerEnd="url(#ae-blk)" />
      <text x="310" y="238" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#7c3ac1">220V AC</text>
      <circle cx="365" cy="324" r="11" fill="#7c3ac1" stroke="white" strokeWidth="2" />
      <text x="365" y="328" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="white" fontWeight="600">5</text>

      {/* Panel solar */}
      <rect x="590" y="120" width="90" height="95" rx="5" fill="#111110" stroke="#f5c842" strokeWidth="2" />
      <g fill="#f5c842" opacity="0.28">
        {[128, 152, 176].map((y) =>
          [598, 622, 646].map((x) => <rect key={`${x}-${y}`} x={x} y={y} width="20" height="20" rx="1" />),
        )}
      </g>
      <text x="635" y="228" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fontWeight="600" fill="#f5c842" letterSpacing="1">PANEL SOLAR</text>
      <text x="635" y="240" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">110–220W</text>
      <path d="M590,167 L560,167 L560,318 L198,318" fill="none" stroke="#f5c842" strokeWidth="2.5" strokeDasharray="7,3" strokeLinecap="round" markerEnd="url(#ae-sol)" />
      <text x="370" y="316" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#f5c842">SOLAR IN</text>

      {/* 12V auto */}
      <rect x="590" y="260" width="90" height="45" rx="5" fill="#2a2a28" stroke="#8A8A82" strokeWidth="1.5" />
      <text x="635" y="278" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">12V AUTO</text>
      <text x="635" y="292" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#8A8A82">Carga en ruta</text>
      <path d="M590,282 L556,282 L556,328 L198,328" fill="none" stroke="#8A8A82" strokeWidth="2" strokeDasharray="5,3" strokeLinecap="round" markerEnd="url(#ae-blk)" />

      {/* Cota */}
      <line x1="38" y1="408" x2="220" y2="408" stroke="#1A1D17" strokeWidth="1" />
      <line x1="38" y1="403" x2="38" y2="413" stroke="#1A1D17" strokeWidth="1" />
      <line x1="220" y1="403" x2="220" y2="413" stroke="#1A1D17" strokeWidth="1" />
      <text x="129" y="422" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#1A1D17">310 mm COMPARTIMENTO</text>

      <text x="570" y="370" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#B8763A" fontWeight="600" letterSpacing="1">SIN TORNILLOS</text>
      <text x="570" y="382" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#B8763A" fontWeight="600" letterSpacing="1">ENSAMBLE PUZZLE</text>
    </svg>
  );
}

function CompareSVG() {
  // Precios reflejan accesorios.json (no los del HTML original).
  return (
    <svg viewBox="0 0 700 420" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full" aria-label="Comparativa EcoFlow River 3, River 3 Plus y River 2 Pro">
      <defs>
        <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a5a7c" /><stop offset="100%" stopColor="#1a2a3a" /></linearGradient>
        <linearGradient id="g3p" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7c5a1a" /><stop offset="100%" stopColor="#3a2a0a" /></linearGradient>
        <linearGradient id="g2p" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5a2a7c" /><stop offset="100%" stopColor="#2a1a3a" /></linearGradient>
      </defs>
      <rect width="700" height="420" fill="#FAF7F0" />
      <g stroke="#e8e4dc" strokeWidth="0.5" opacity="0.4">
        {Array.from({ length: 10 }).map((_, i) => <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="700" y2={40 * (i + 1)} />)}
        {Array.from({ length: 5 }).map((_, i) => <line key={`v${i}`} x1={120 * (i + 1)} y1="0" x2={120 * (i + 1)} y2="420" />)}
      </g>
      <text x="350" y="26" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#8A8A82" letterSpacing="3">COMPARATIVA DIMENSIONAL Y FUNCIONAL — VISTA FRONTAL</text>

      {/* River 3 */}
      <g transform="translate(30,38)">
        <rect x="0" y="0" width="190" height="26" rx="3" fill="#3a7fc1" />
        <text x="95" y="11" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="12" fontWeight="600" fill="white" letterSpacing="2">RIVER 3</text>
        <text x="95" y="22" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="rgba(255,255,255,0.7)">256 Wh · 300W · 3.55 kg</text>
        <rect x="0" y="30" width="190" height="250" rx="8" fill="url(#g3)" stroke="#1a2a3a" strokeWidth="2" />
        <rect x="8" y="38" width="174" height="34" rx="4" fill="#111110" />
        <text x="95" y="52" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#B8763A" fontWeight="600">ECOFLOW</text>
        <text x="95" y="65" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">RIVER 3</text>
        <rect x="10" y="80" width="170" height="12" rx="3" fill="#1F4F38" />
        <rect x="10" y="80" width="128" height="12" rx="3" fill="#5fb360" opacity="0.7" />
        <text x="145" y="90" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">75%</text>
        <rect x="10" y="100" width="36" height="12" rx="2" fill="#B8763A" />
        <text x="28" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="#1A1D17" fontWeight="600">USB×2</text>
        <rect x="52" y="100" width="28" height="12" rx="2" fill="#B8763A" />
        <text x="66" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="#1A1D17">USB-C</text>
        <rect x="86" y="100" width="36" height="12" rx="2" fill="#8A8A82" />
        <text x="104" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="white">12V DC</text>
        <rect x="128" y="100" width="30" height="12" rx="2" fill="#7c3ac1" />
        <text x="143" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="white">1×AC</text>
        <text x="95" y="130" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fill="#7ab4e8" letterSpacing="1">256 Wh</text>
        <text x="95" y="146" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#8A8A82">300W nominal</text>
        <text x="95" y="162" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#8A8A82">600W X-Boost</text>
        <text x="95" y="185" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">~18 h cooler</text>
        <text x="95" y="200" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">3.55 kg</text>
        <rect x="10" y="215" width="170" height="20" rx="3" fill="#1A1D17" />
        <text x="95" y="228" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#5fb360">IP54 · LFP · 3000 ciclos · 10 años</text>
        <rect x="10" y="240" width="170" height="14" rx="2" fill="#2a2a28" />
        <text x="95" y="250" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6.5" fill="#8A8A82">255×212×113 mm</text>
        <text x="100" y="335" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">295 mm · COMPARTIMENTO</text>
        <rect x="20" y="360" width="150" height="22" rx="3" fill="#3a7fc1" />
        <text x="95" y="375" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="white" letterSpacing="1">$275.000</text>
      </g>

      {/* River 3 Plus */}
      <g transform="translate(255,38)">
        <rect x="0" y="0" width="190" height="26" rx="3" fill="#B8763A" />
        <text x="95" y="11" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="12" fontWeight="600" fill="white" letterSpacing="2">RIVER 3 PLUS</text>
        <text x="95" y="22" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="rgba(255,255,255,0.7)">286 Wh · 600W · 4.7 kg</text>
        <rect x="15" y="-14" width="160" height="20" rx="3" fill="#1A1D17" />
        <text x="95" y="-1" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#B8763A" letterSpacing="2">RECOMENDADO</text>
        <rect x="0" y="30" width="190" height="280" rx="8" fill="url(#g3p)" stroke="#3a2a0a" strokeWidth="2.5" />
        <rect x="8" y="38" width="174" height="34" rx="4" fill="#111110" />
        <text x="95" y="52" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#B8763A" fontWeight="600">ECOFLOW</text>
        <text x="95" y="65" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">RIVER 3 PLUS</text>
        <rect x="10" y="80" width="170" height="12" rx="3" fill="#1F4F38" />
        <rect x="10" y="80" width="128" height="12" rx="3" fill="#5fb360" opacity="0.7" />
        <text x="145" y="90" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">75%</text>
        <rect x="10" y="100" width="36" height="12" rx="2" fill="#B8763A" />
        <text x="28" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="#1A1D17" fontWeight="600">USB×2</text>
        <rect x="52" y="100" width="28" height="12" rx="2" fill="#B8763A" />
        <text x="66" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="#1A1D17">USB-C</text>
        <rect x="86" y="100" width="36" height="12" rx="2" fill="#8A8A82" />
        <text x="104" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="white">12V DC</text>
        <rect x="128" y="100" width="50" height="12" rx="2" fill="#7c3ac1" />
        <text x="153" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="white">3×AC</text>
        <text x="95" y="130" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fill="#f5c842" letterSpacing="1">286 → 858 Wh</text>
        <text x="95" y="146" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#8A8A82">600W nominal</text>
        <text x="95" y="162" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#8A8A82">1200W X-Boost</text>
        <text x="95" y="185" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">~20 h cooler</text>
        <text x="95" y="200" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">4.7 kg</text>
        <rect x="10" y="210" width="170" height="20" rx="3" fill="#B8763A" opacity="0.25" stroke="#B8763A" strokeWidth="1" />
        <text x="95" y="223" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#B8763A">AMPLIABLE +EB300/EB600</text>
        <rect x="10" y="236" width="170" height="20" rx="3" fill="#1A1D17" />
        <text x="95" y="249" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#5fb360">IP54 · LFP · 3000 ciclos · 10 años</text>
        <rect x="10" y="261" width="170" height="14" rx="2" fill="#2a2a28" />
        <text x="95" y="271" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6.5" fill="#8A8A82">234×232×146 mm</text>
        <text x="100" y="345" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">274 mm · COMPARTIMENTO</text>
        <rect x="20" y="372" width="150" height="22" rx="3" fill="#B8763A" />
        <text x="95" y="387" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="white" letterSpacing="1">$340.000</text>
      </g>

      {/* River 2 Pro */}
      <g transform="translate(480,38)">
        <rect x="0" y="0" width="190" height="26" rx="3" fill="#7c3ac1" />
        <text x="95" y="11" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="12" fontWeight="600" fill="white" letterSpacing="2">RIVER 2 PRO</text>
        <text x="95" y="22" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="rgba(255,255,255,0.7)">768 Wh · 800W · 7.8 kg</text>
        <rect x="0" y="30" width="190" height="310" rx="8" fill="url(#g2p)" stroke="#2a1a3a" strokeWidth="2.5" />
        <rect x="8" y="38" width="174" height="34" rx="4" fill="#111110" />
        <text x="95" y="52" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#B8763A" fontWeight="600">ECOFLOW</text>
        <text x="95" y="65" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">RIVER 2 PRO</text>
        <rect x="10" y="80" width="170" height="12" rx="3" fill="#1F4F38" />
        <rect x="10" y="80" width="128" height="12" rx="3" fill="#5fb360" opacity="0.7" />
        <text x="145" y="90" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">75%</text>
        <rect x="10" y="100" width="36" height="12" rx="2" fill="#B8763A" />
        <text x="28" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="#1A1D17" fontWeight="600">USB×2</text>
        <rect x="52" y="100" width="28" height="12" rx="2" fill="#B8763A" />
        <text x="66" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="#1A1D17">USB-C</text>
        <rect x="86" y="100" width="36" height="12" rx="2" fill="#8A8A82" />
        <text x="104" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="white">12V DC</text>
        <rect x="128" y="100" width="50" height="12" rx="2" fill="#7c3ac1" />
        <text x="153" y="109" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="5.5" fill="white">3×AC</text>
        <text x="95" y="130" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fill="#c4a0f0" letterSpacing="1">768 Wh</text>
        <text x="95" y="146" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#8A8A82">800W nominal</text>
        <text x="95" y="162" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#8A8A82">1600W X-Boost</text>
        <text x="95" y="185" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#5fb360">~54 h cooler</text>
        <text x="95" y="200" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">7.8 kg</text>
        <rect x="10" y="210" width="170" height="20" rx="3" fill="#7c3ac1" opacity="0.3" stroke="#7c3ac1" strokeWidth="1" />
        <text x="95" y="223" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#c4a0f0">CERT. TÜV RHEINLAND</text>
        <rect x="10" y="236" width="170" height="20" rx="3" fill="#1A1D17" />
        <text x="95" y="249" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#5fb360">LFP · 3000 ciclos · 10 años</text>
        <rect x="10" y="261" width="170" height="14" rx="2" fill="#2a2a28" />
        <text x="95" y="271" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6.5" fill="#8A8A82">270×260×226 mm</text>
        <text x="100" y="371" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">310 mm · COMPARTIMENTO</text>
        <rect x="20" y="396" width="150" height="22" rx="3" fill="#7c3ac1" />
        <text x="95" y="411" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="white" letterSpacing="1">$560.000</text>
      </g>

      <text x="350" y="408" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">ESCALA APROX. 1:2.5 · HOLGURA +40 mm PROFUNDIDAD, +20 mm ANCHO INCLUIDA</text>
    </svg>
  );
}

function AutonomySVG() {
  return (
    <svg viewBox="0 0 700 400" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full" aria-label="Autonomía estimada del sistema Campero por modelo EcoFlow">
      <rect width="700" height="400" fill="#FAF7F0" />
      <g stroke="#e8e4dc" strokeWidth="0.5" opacity="0.4">
        {Array.from({ length: 9 }).map((_, i) => <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="700" y2={40 * (i + 1)} />)}
        {Array.from({ length: 5 }).map((_, i) => <line key={`v${i}`} x1={120 * (i + 1)} y1="0" x2={120 * (i + 1)} y2="400" />)}
      </g>
      <text x="350" y="26" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#8A8A82" letterSpacing="3">AUTONOMÍA POR MODELO — CONSUMIDORES DEL SISTEMA CAMPERO</text>

      <text x="10" y="55" fontFamily="var(--font-geist-sans), sans-serif" fontSize="11" fontWeight="600" fill="#1A1D17" letterSpacing="1">COOLER ALPICOOL (35W PICO · 14 Wh/h EFECTIVO)</text>
      <rect x="10" y="60" width="640" height="18" rx="3" fill="rgba(58,127,193,0.1)" stroke="#3a7fc1" strokeWidth="1" />
      <rect x="10" y="60" width="213" height="18" rx="3" fill="#3a7fc1" opacity="0.6" />
      <text x="229" y="73" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#3a7fc1" fontWeight="600">R3: ~18 h</text>
      <rect x="10" y="82" width="640" height="18" rx="3" fill="rgba(184,118,58,0.08)" stroke="#B8763A" strokeWidth="1" />
      <rect x="10" y="82" width="238" height="18" rx="3" fill="#B8763A" opacity="0.6" />
      <text x="254" y="95" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A" fontWeight="600">R3+: ~20 h</text>
      <rect x="10" y="104" width="640" height="18" rx="3" fill="rgba(124,58,193,0.08)" stroke="#7c3ac1" strokeWidth="1" />
      <rect x="10" y="104" width="640" height="18" rx="3" fill="#7c3ac1" opacity="0.6" />
      <text x="656" y="117" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#7c3ac1" fontWeight="600">R2P: ~55 h</text>

      <text x="10" y="142" fontFamily="var(--font-geist-sans), sans-serif" fontSize="11" fontWeight="600" fill="#1A1D17" letterSpacing="1">BOMBA AGUA (10W · 5 min/día · 0.8 Wh/día)</text>
      <rect x="10" y="148" width="640" height="18" rx="3" fill="rgba(184,118,58,0.06)" stroke="#B8763A" strokeWidth="1" />
      <rect x="10" y="148" width="4" height="18" rx="2" fill="#B8763A" opacity="0.8" />
      <text x="20" y="161" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">IMPACTO DESPRECIABLE</text>

      <text x="10" y="188" fontFamily="var(--font-geist-sans), sans-serif" fontSize="11" fontWeight="600" fill="#1A1D17" letterSpacing="1">LUCES LED INTERIOR/EXTERIOR (5W · 4 h/día · 20 Wh/día)</text>
      <rect x="10" y="194" width="640" height="18" rx="3" fill="rgba(245,200,66,0.08)" stroke="#f5c842" strokeWidth="1" />
      <rect x="10" y="194" width="158" height="18" rx="3" fill="#f5c842" opacity="0.55" />
      <text x="174" y="207" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#1A1D17" fontWeight="600">R3: 13 días solo luces</text>
      <rect x="10" y="216" width="640" height="18" rx="3" fill="rgba(245,200,66,0.08)" stroke="#f5c842" strokeWidth="1" />
      <rect x="10" y="216" width="178" height="18" rx="3" fill="#f5c842" opacity="0.45" />
      <text x="194" y="229" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#1A1D17" fontWeight="600">R3+: 14 días solo luces</text>
      <rect x="10" y="238" width="640" height="18" rx="3" fill="rgba(245,200,66,0.08)" stroke="#f5c842" strokeWidth="1" />
      <rect x="10" y="238" width="480" height="18" rx="3" fill="#f5c842" opacity="0.45" />
      <text x="496" y="251" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#1A1D17" fontWeight="600">R2P: 38 días solo luces</text>

      <rect x="10" y="270" width="680" height="110" rx="5" fill="#1A1D17" />
      <text x="350" y="292" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="#B8763A" letterSpacing="3">USO REAL CAMPERO (COOLER + LUCES + BOMBA ≈ 34 Wh/día)</text>
      <rect x="24" y="302" width="194" height="66" rx="4" fill="#3a7fc1" opacity="0.2" stroke="#3a7fc1" strokeWidth="1" />
      <text x="121" y="322" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="14" fontWeight="600" fill="#3a7fc1">RIVER 3</text>
      <text x="121" y="340" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="11" fill="#5fb360" fontWeight="600">~7 días</text>
      <text x="121" y="358" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">256 ÷ 34 ≈ 7</text>
      <rect x="240" y="302" width="194" height="66" rx="4" fill="#B8763A" opacity="0.2" stroke="#B8763A" strokeWidth="1" />
      <text x="337" y="322" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="14" fontWeight="600" fill="#B8763A">RIVER 3 PLUS</text>
      <text x="337" y="340" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="11" fill="#5fb360" fontWeight="600">~8 días</text>
      <text x="337" y="358" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">286 ÷ 34 ≈ 8</text>
      <rect x="456" y="302" width="220" height="66" rx="4" fill="#7c3ac1" opacity="0.2" stroke="#7c3ac1" strokeWidth="1" />
      <text x="566" y="322" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="14" fontWeight="600" fill="#c4a0f0">RIVER 2 PRO</text>
      <text x="566" y="340" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="13" fill="#5fb360" fontWeight="600">~22 días</text>
      <text x="566" y="358" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">768 ÷ 34 ≈ 22</text>
    </svg>
  );
}
