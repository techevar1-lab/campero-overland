"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import accesoriosData from "@data/accesorios.json";
import { formatPrice, type Price } from "@/lib/format";

type Model = "x18" | "x30";
type Tab = "diagram" | "compare" | "energy";

const SPEC_DATA: Record<
  Model,
  {
    cap: string;
    largo: string;
    ancho: string;
    alto: string;
    peso: string;
    cons: string;
    temp: string;
    bt: string;
    usb: string;
    vaso: string;
    cLargo: string;
    cAncho: string;
    cAlto: string;
  }
> = {
  x18: {
    cap: "18 L",
    largo: "600 mm",
    ancho: "330 mm",
    alto: "320 mm",
    peso: "10.5 kg",
    cons: "35 W",
    temp: "−20 °C",
    bt: "Sí",
    usb: "Sí",
    vaso: "No",
    cLargo: "640 mm",
    cAncho: "390 mm",
    cAlto: "400 mm",
  },
  x30: {
    cap: "30 L",
    largo: "603 mm",
    ancho: "374 mm",
    alto: "372 mm",
    peso: "~13 kg",
    cons: "35 W",
    temp: "−20 °C",
    bt: "Sí",
    usb: "Sí",
    vaso: "2 integrados",
    cLargo: "663 mm",
    cAncho: "434 mm",
    cAlto: "452 mm",
  },
};

function getFridgePrices(): { id: Model; price: Price }[] {
  const group = (accesoriosData as { groups: { id: string; variants: { id: string; price: Price }[] }[] }).groups.find(
    (g) => g.id === "fridge",
  );
  if (!group) return [];
  const map: Record<string, Model> = {
    fridge_18: "x18",
    fridge_30: "x30",
  };
  return group.variants
    .map((v) => ({ id: map[v.id], price: v.price }))
    .filter((p): p is { id: Model; price: Price } => Boolean(p.id));
}

export function FichaRefrigeracion() {
  const t = useTranslations("FichaRefrigeracion");
  const [tab, setTab] = useState<Tab>("diagram");
  const [model, setModel] = useState<Model>("x18");
  const spec = SPEC_DATA[model];
  const prices = getFridgePrices();

  return (
    <article className="font-sans text-ink">
      {/* HEADER */}
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

      {/* TABS */}
      <div role="tablist" aria-label={t("tabsAriaLabel")} className="flex flex-wrap border-b-2 border-green-deep bg-cream">
        {(["diagram", "compare", "energy"] as Tab[]).map((id, i) => {
          const isActive = tab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              aria-controls={`ficha-refri-panel-${id}`}
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

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
        <section
          id={`ficha-refri-panel-${tab}`}
          role="tabpanel"
          className="flex flex-col gap-6 border-b border-green-deep/15 p-6 lg:border-b-0 lg:border-r-2 lg:border-r-green-deep lg:p-8"
        >
          {tab === "diagram" ? <DiagramTab /> : null}
          {tab === "compare" ? <CompareTab /> : null}
          {tab === "energy" ? <EnergyTab /> : null}
        </section>

        <aside className="flex flex-col gap-6 p-6">
          {/* Model selector */}
          <section>
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">{t("sidebar.modelLabel")}</p>
            <div className="flex gap-2">
              {(["x18", "x30"] as Model[]).map((m) => {
                const active = model === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModel(m)}
                    className={`flex flex-1 flex-col items-center gap-0.5 border-[1.5px] px-2 py-2.5 transition-colors ${
                      active ? "border-[#3a7fc1] bg-[#3a7fc1] text-cream" : "border-line text-ink hover:border-[#3a7fc1]"
                    }`}
                  >
                    <span className="font-serif text-lg leading-none">{m === "x18" ? "X18" : "X30"}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[1.5px] opacity-70">
                      {m === "x18" ? t("sidebar.x18Litros") : t("sidebar.x30Litros")}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Ficha técnica */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">{t("sidebar.specsLabel")}</p>
            <dl className="grid grid-cols-2 gap-y-2">
              <DimRow label={t("sidebar.capacidad")} value={spec.cap} highlight />
              <DimRow label={t("sidebar.largo")} value={spec.largo} />
              <DimRow label={t("sidebar.ancho")} value={spec.ancho} />
              <DimRow label={t("sidebar.alto")} value={spec.alto} />
              <DimRow label={t("sidebar.pesoNeto")} value={spec.peso} />
              <DimRow label={t("sidebar.consumoPico")} value={spec.cons} />
              <DimRow label={t("sidebar.tMinima")} value={spec.temp} />
              <DimRow label={t("sidebar.bluetooth")} value={spec.bt} />
              <DimRow label={t("sidebar.puertoUsb")} value={spec.usb} />
              <DimRow label={t("sidebar.portavasos")} value={spec.vaso} />
            </dl>
          </section>

          {/* Dimensiones compartimento */}
          <section className="border-t border-line pt-5">
            <p className="mb-3 font-mono text-[9px] uppercase tracking-[3px] text-ink-soft">{t("sidebar.compartLabel")}</p>
            <ul className="bg-green-deep p-3.5 font-mono text-[10px] leading-relaxed text-cream/85">
              <SpecRow k={t("sidebar.cLargo")} v={spec.cLargo} />
              <SpecRow k={t("sidebar.cAncho")} v={spec.cAncho} />
              <SpecRow k={t("sidebar.cAlto")} v={spec.cAlto} />
              <SpecRow k={t("sidebar.cHolgura")} v={t("sidebar.cHolguraValue")} />
              <SpecRow k={t("sidebar.cVentil")} v={t("sidebar.cVentilValue")} />
              <SpecRow k={t("sidebar.cRieles")} v={t("sidebar.cRielesValue")} />
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
                    {p.id === "x18" ? t("sidebar.priceX18") : t("sidebar.priceX30")}
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
                <strong className="font-medium">X18</strong> — {t("sidebar.x18Body")}
              </p>
              <p className="border-l-[3px] border-green-deep bg-green-deep/[0.06] px-3 py-2">
                <strong className="font-medium">X30</strong> — {t("sidebar.x30Body")}
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
        {titleParts.plain} <em className="italic text-[#3a7fc1]">{titleParts.em}</em>
      </h3>
    </div>
  );
}

/* ============ TABS ============ */

function DiagramTab() {
  const t = useTranslations("FichaRefrigeracion.diagram");
  return (
    <>
      <TabHeader label={t("label")} titleParts={{ plain: t("titlePlain"), em: t("titleEm") }} />
      <div className="border border-green-deep/15 bg-cream-pure p-4">
        <DiagramSVG />
      </div>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-[1.5px] text-ink">
        <LegendItem color="#3a7fc1" label={t("legend.cold")} />
        <LegendItem color="#B8763A" label={t("legend.power")} />
        <LegendItem color="#8A8A82" label={t("legend.rails")} />
        <LegendItem color="#a84b2a" label={t("legend.vent")} />
      </ul>
      <p className="border-l-[3px] border-[#3a7fc1] bg-[#3a7fc1]/[0.08] px-3.5 py-3 font-sans text-[12px] leading-[1.55] text-ink">
        <strong className="font-medium text-ink">{t("noteTitle")}:</strong> {t("noteBody")}
      </p>
    </>
  );
}

function CompareTab() {
  const t = useTranslations("FichaRefrigeracion.compare");
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

function EnergyTab() {
  const t = useTranslations("FichaRefrigeracion.energy");
  return (
    <>
      <TabHeader label={t("label")} titleParts={{ plain: t("titlePlain"), em: t("titleEm") }} />
      <div className="border border-green-deep/15 bg-cream-pure p-4">
        <EnergySVG />
      </div>
      <p className="border-l-[3px] border-[#3a7fc1] bg-[#3a7fc1]/[0.08] px-3.5 py-3 font-sans text-[12px] leading-[1.55] text-ink">
        <strong className="font-medium text-ink">{t("noteTitle")}:</strong> {t("noteBody")}
      </p>
    </>
  );
}

/* ============ SVGs ============ */

function DiagramSVG() {
  return (
    <svg viewBox="0 0 680 430" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full" aria-label="Diagrama: cooler Alpicool sobre rieles ajustables, alimentado por EcoFlow vía 12V DC">
      <defs>
        <marker id="arr-cold-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#3a7fc1" /></marker>
        <marker id="arr-ocre-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#B8763A" /></marker>
        <marker id="arr-r" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#1A1D17" /></marker>
        <pattern id="wood-r" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#e8d4b8" />
          <line x1="0" y1="0" x2="8" y2="0" stroke="#d4c4a0" strokeWidth="0.5" />
          <line x1="0" y1="4" x2="8" y2="4" stroke="#d0be9a" strokeWidth="0.3" />
        </pattern>
        <pattern id="wood-d-r" patternUnits="userSpaceOnUse" width="8" height="8">
          <rect width="8" height="8" fill="#c4956a" />
          <line x1="0" y1="0" x2="8" y2="0" stroke="#b07a50" strokeWidth="0.5" />
        </pattern>
        <linearGradient id="coldGrad-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8e8f8" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#7ab4e8" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="compGrad-r" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3a3a38" />
          <stop offset="100%" stopColor="#1A1D17" />
        </linearGradient>
      </defs>

      <rect width="680" height="430" fill="#FAF7F0" />
      <g stroke="#e8e4dc" strokeWidth="0.5" opacity="0.5">
        {Array.from({ length: 10 }).map((_, i) => <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="680" y2={40 * (i + 1)} />)}
        {Array.from({ length: 16 }).map((_, i) => <line key={`v${i}`} x1={40 * (i + 1)} y1="0" x2={40 * (i + 1)} y2="430" />)}
      </g>

      {/* Mueble */}
      <rect x="30" y="95" width="500" height="295" rx="3" fill="url(#wood-r)" stroke="#8b5e3c" strokeWidth="2.5" />
      <rect x="30" y="87" width="500" height="12" rx="2" fill="#c4956a" stroke="#8b5e3c" strokeWidth="1.5" />
      <rect x="350" y="95" width="12" height="295" fill="url(#wood-d-r)" stroke="#7a4e2c" strokeWidth="1" />
      <text x="34" y="84" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#8b5e3c" letterSpacing="3">SECCIÓN REFRIGERACIÓN</text>

      {/* Corral riel */}
      <rect x="40" y="105" width="300" height="275" rx="3" fill="rgba(58,127,193,0.06)" stroke="#3a7fc1" strokeWidth="1" strokeDasharray="5,3" />
      <rect x="40" y="105" width="12" height="275" rx="2" fill="#8A8A82" stroke="#606060" strokeWidth="1" />
      <rect x="328" y="105" width="12" height="275" rx="2" fill="#8A8A82" stroke="#606060" strokeWidth="1" />
      <g stroke="#606060" strokeWidth="0.8">
        {[130, 155, 180, 205, 230, 255, 280, 305].map((y) => (
          <g key={y}>
            <line x1="46" y1={y} x2="46" y2={y + 8} />
            <line x1="334" y1={y} x2="334" y2={y + 8} />
          </g>
        ))}
      </g>
      <text x="190" y="118" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="8" fontWeight="600" fill="#8b5e3c" letterSpacing="2">RIELES AJUSTABLES (±25mm)</text>

      {/* Alpicool body */}
      <rect x="58" y="125" width="224" height="230" rx="10" fill="url(#compGrad-r)" stroke="#1A1D17" strokeWidth="2.5" />
      <rect x="58" y="125" width="224" height="42" rx="10" fill="#4a4a48" stroke="#1A1D17" strokeWidth="2.5" />
      <rect x="58" y="160" width="224" height="6" fill="#2a2a28" stroke="#1A1D17" strokeWidth="1" />
      <rect x="70" y="175" width="200" height="170" rx="6" fill="url(#coldGrad-r)" stroke="#3a7fc1" strokeWidth="1.5" />
      <g opacity="0.5">
        {[200, 220, 240, 260].map((y) => (
          <line key={y} x1="80" y1={y} x2="260" y2={y} stroke="#7ab4e8" strokeWidth="0.8" strokeDasharray="3,4" />
        ))}
      </g>
      <rect x="75" y="180" width="70" height="30" rx="3" fill="#1A1D17" />
      <text x="110" y="200" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="11" fill="#5fb360" fontWeight="600">-8 °C</text>
      <circle cx="240" cy="145" r="12" fill="#B8763A" stroke="#9F632F" strokeWidth="2" />
      <text x="240" y="149" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="white" fontWeight="600">ON</text>
      <rect x="68" y="132" width="148" height="22" rx="3" fill="#1A1D17" />
      <text x="142" y="147" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#B8763A">ALPICOOL</text>
      <rect x="70" y="342" width="22" height="10" rx="2" fill="#3a7fc1" />
      <text x="81" y="350" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="6" fill="white">USB</text>

      {/* Compresor */}
      <rect x="75" y="318" width="190" height="28" rx="4" fill="#2a2a28" stroke="#1A1D17" strokeWidth="1.5" />
      <text x="170" y="334" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fontWeight="600" fill="#7ab4e8" letterSpacing="2">COMPRESOR</text>
      <g stroke="#4a4a48" strokeWidth="1">
        {[220, 226, 232, 238, 244].map((x) => <line key={x} x1={x} y1="320" x2={x} y2="344" />)}
      </g>

      <path d="M110,125 Q170,108 230,125" fill="none" stroke="#8A8A82" strokeWidth="5" strokeLinecap="round" />
      <circle cx="72" cy="138" r="11" fill="#3a7fc1" stroke="white" strokeWidth="2" />
      <text x="72" y="142" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="white" fontWeight="600">1</text>

      {/* Cable 12V */}
      <path d="M530,240 L570,240 L570,360 L60,360 L60,350" fill="none" stroke="#B8763A" strokeWidth="3" strokeDasharray="7,3" strokeLinecap="round" markerEnd="url(#arr-ocre-r)" />
      <text x="575" y="308" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A" transform="rotate(90,575,308)">12V DC</text>

      {/* EcoFlow */}
      <text x="368" y="84" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#1A1D17" letterSpacing="3">SECCIÓN ENERGÍA</text>
      <rect x="368" y="110" width="148" height="260" rx="5" fill="#2a2a28" stroke="#1A1D17" strokeWidth="2" />
      <rect x="376" y="120" width="132" height="50" rx="4" fill="#3a3a38" />
      <text x="442" y="138" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A" fontWeight="600">ECOFLOW</text>
      <text x="442" y="152" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#8A8A82" letterSpacing="1">ESTACIÓN DE ENERGÍA</text>
      <rect x="386" y="178" width="32" height="14" rx="2" fill="#B8763A" />
      <text x="402" y="188" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#1A1D17" fontWeight="600">12V</text>
      <rect x="426" y="178" width="26" height="14" rx="2" fill="#B8763A" />
      <text x="439" y="188" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#1A1D17">USB</text>
      <rect x="376" y="200" width="132" height="110" rx="3" fill="#1A1D17" />
      <rect x="383" y="207" width="118" height="96" rx="2" fill="#2a2a28" />
      <rect x="390" y="215" width="104" height="10" rx="2" fill="#1F4F38" />
      <rect x="390" y="215" width="80" height="10" rx="2" fill="#5fb360" opacity="0.85" />
      <text x="442" y="240" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#5fb360" fontWeight="600">77%</text>
      <text x="442" y="258" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">768Wh</text>
      <text x="442" y="274" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#B8763A">35W activo</text>
      <text x="442" y="288" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">~22h restantes</text>
      <circle cx="382" cy="127" r="11" fill="#B8763A" stroke="white" strokeWidth="2" />
      <text x="382" y="131" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="white" fontWeight="600">2</text>

      {/* Cotas */}
      <line x1="40" y1="408" x2="340" y2="408" stroke="#1A1D17" strokeWidth="1" />
      <line x1="40" y1="403" x2="40" y2="413" stroke="#1A1D17" strokeWidth="1" />
      <line x1="340" y1="403" x2="340" y2="413" stroke="#1A1D17" strokeWidth="1" />
      <text x="190" y="422" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17">640 mm compartimento</text>

      <line x1="548" y1="95" x2="548" y2="390" stroke="#1A1D17" strokeWidth="1" />
      <line x1="543" y1="95" x2="553" y2="95" stroke="#1A1D17" strokeWidth="1" />
      <line x1="543" y1="390" x2="553" y2="390" stroke="#1A1D17" strokeWidth="1" />
      <text x="562" y="247" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" transform="rotate(90,562,247)">ALTO MÓDULO →</text>

      <path d="M282,348 Q310,348 310,380 L310,395" fill="none" stroke="#a84b2a" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#arr-r)" />
      <text x="290" y="410" fontFamily="var(--font-geist-sans), sans-serif" fontSize="8" fontWeight="600" fill="#a84b2a" letterSpacing="1">VENTILACIÓN</text>
      <text x="290" y="420" fontFamily="var(--font-geist-sans), sans-serif" fontSize="8" fill="#a84b2a" letterSpacing="1">COMPRESOR →</text>

      <text x="540" y="115" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#B8763A" fontWeight="600" letterSpacing="1">ENSAMBLE</text>
      <text x="540" y="127" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#B8763A" fontWeight="600" letterSpacing="1">SIN TORNILLOS</text>
    </svg>
  );
}

function CompareSVG() {
  return (
    <svg viewBox="0 0 680 400" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full" aria-label="Comparativa visual Alpicool X18 vs X30">
      <defs>
        <linearGradient id="cg18-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c8e8f8" /><stop offset="100%" stopColor="#7ab4e8" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="cg30-r" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a0ccee" /><stop offset="100%" stopColor="#3a7fc1" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <rect width="680" height="400" fill="#FAF7F0" />
      <g stroke="#e8e4dc" strokeWidth="0.5" opacity="0.5">
        {Array.from({ length: 9 }).map((_, i) => <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="680" y2={40 * (i + 1)} />)}
        {Array.from({ length: 8 }).map((_, i) => <line key={`v${i}`} x1={80 * (i + 1)} y1="0" x2={80 * (i + 1)} y2="400" />)}
      </g>

      <text x="340" y="28" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#8A8A82" letterSpacing="3">COMPARATIVA DIMENSIONAL — VISTA FRONTAL</text>

      {/* X18 */}
      <g transform="translate(60, 45)">
        <rect x="0" y="0" width="220" height="32" rx="3" fill="#3a7fc1" />
        <text x="110" y="14" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="white" letterSpacing="3">ALPICOOL X18</text>
        <text x="110" y="26" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="rgba(255,255,255,0.7)">18 L · 60 × 33 × 32 cm</text>
        <rect x="10" y="42" width="200" height="107" rx="8" fill="url(#cg18-r)" stroke="#3a7fc1" strokeWidth="2" />
        <rect x="10" y="42" width="200" height="30" rx="8" fill="#2a2a28" stroke="#1A1D17" strokeWidth="2" />
        <rect x="18" y="50" width="100" height="16" rx="2" fill="#1A1D17" />
        <text x="68" y="61" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#B8763A">ALPICOOL</text>
        <circle cx="188" cy="56" r="9" fill="#B8763A" stroke="#9F632F" strokeWidth="1.5" />
        <rect x="18" y="80" width="184" height="60" rx="4" fill="rgba(255,255,255,0.55)" />
        <text x="110" y="114" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="11" fill="#1A1D17" fontWeight="600">18 L</text>
        <rect x="10" y="130" width="200" height="19" rx="4" fill="#1A1D17" />
        <text x="110" y="142" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#7ab4e8" letterSpacing="2">COMPRESOR</text>
        <line x1="10" y1="165" x2="210" y2="165" stroke="#1A1D17" strokeWidth="1" />
        <line x1="10" y1="161" x2="10" y2="169" stroke="#1A1D17" strokeWidth="1" />
        <line x1="210" y1="161" x2="210" y2="169" stroke="#1A1D17" strokeWidth="1" />
        <text x="110" y="178" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" fontWeight="600">600 mm</text>
        <line x1="218" y1="42" x2="228" y2="42" stroke="#1A1D17" strokeWidth="1" />
        <line x1="218" y1="149" x2="228" y2="149" stroke="#1A1D17" strokeWidth="1" />
        <line x1="223" y1="42" x2="223" y2="149" stroke="#1A1D17" strokeWidth="1" />
        <text x="234" y="101" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" fontWeight="600" transform="rotate(90,234,101)">320 mm</text>
        <line x1="0" y1="192" x2="220" y2="192" stroke="#B8763A" strokeWidth="1.5" strokeDasharray="5,3" />
        <line x1="0" y1="188" x2="0" y2="196" stroke="#B8763A" strokeWidth="1.5" />
        <line x1="220" y1="188" x2="220" y2="196" stroke="#B8763A" strokeWidth="1.5" />
        <text x="110" y="207" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">640 mm · COMPARTIMENTO</text>
        <text x="110" y="232" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fill="#3a7fc1" fontWeight="600">PESO: 10.5 kg</text>
      </g>

      {/* X30 */}
      <g transform="translate(350, 45)">
        <rect x="0" y="0" width="270" height="32" rx="3" fill="#1A1D17" />
        <text x="135" y="14" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="#3a7fc1" letterSpacing="3">ALPICOOL X30</text>
        <text x="135" y="26" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="rgba(255,255,255,0.5)">30 L · 60.3 × 37.4 × 37.2 cm</text>
        <rect x="10" y="42" width="201" height="124" rx="8" fill="url(#cg30-r)" stroke="#1a4a7c" strokeWidth="2.5" />
        <rect x="10" y="42" width="201" height="30" rx="8" fill="#2a2a28" stroke="#1A1D17" strokeWidth="2.5" />
        <rect x="18" y="50" width="100" height="16" rx="2" fill="#1A1D17" />
        <text x="68" y="61" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#B8763A">ALPICOOL</text>
        <rect x="158" y="47" width="16" height="10" rx="3" fill="#3a3a38" stroke="#555" strokeWidth="1" />
        <rect x="178" y="47" width="16" height="10" rx="3" fill="#3a3a38" stroke="#555" strokeWidth="1" />
        <text x="176" y="43" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="7" fill="#7ab4e8" letterSpacing="1">2× VASO</text>
        <circle cx="200" cy="60" r="9" fill="#B8763A" stroke="#9F632F" strokeWidth="1.5" />
        <rect x="18" y="80" width="185" height="77" rx="4" fill="rgba(255,255,255,0.55)" />
        <text x="110" y="123" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="12" fill="#1A1D17" fontWeight="600">30 L</text>
        <rect x="10" y="148" width="201" height="18" rx="4" fill="#1A1D17" />
        <text x="105" y="160" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="9" fill="#7ab4e8" letterSpacing="2">COMPRESOR</text>
        <line x1="10" y1="173" x2="211" y2="173" stroke="#1A1D17" strokeWidth="1" />
        <line x1="10" y1="169" x2="10" y2="177" stroke="#1A1D17" strokeWidth="1" />
        <line x1="211" y1="169" x2="211" y2="177" stroke="#1A1D17" strokeWidth="1" />
        <text x="110" y="186" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" fontWeight="600">603 mm</text>
        <line x1="219" y1="42" x2="229" y2="42" stroke="#1A1D17" strokeWidth="1" />
        <line x1="219" y1="166" x2="229" y2="166" stroke="#1A1D17" strokeWidth="1" />
        <line x1="224" y1="42" x2="224" y2="166" stroke="#1A1D17" strokeWidth="1" />
        <text x="235" y="109" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#1A1D17" fontWeight="600" transform="rotate(90,235,109)">372 mm</text>
        <line x1="0" y1="200" x2="240" y2="200" stroke="#B8763A" strokeWidth="1.5" strokeDasharray="5,3" />
        <line x1="0" y1="196" x2="0" y2="204" stroke="#B8763A" strokeWidth="1.5" />
        <line x1="240" y1="196" x2="240" y2="204" stroke="#B8763A" strokeWidth="1.5" />
        <text x="120" y="215" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">663 mm · COMPARTIMENTO</text>
        <text x="120" y="240" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fill="#3a7fc1" fontWeight="600">PESO: ~13 kg estimado</text>
      </g>

      <text x="340" y="330" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="14" fontWeight="600" fill="#1A1D17" letterSpacing="2">DIFERENCIA DIMENSIONAL</text>
      <text x="340" y="350" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#3a7fc1">Ancho: +43 mm · Alto: +52 mm · Largo: +3 mm</text>
      <text x="340" y="368" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#8A8A82">Los rieles ajustables del corral absorben ambos formatos</text>
      <text x="340" y="384" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#B8763A">Definir un tamaño de compartimento por modelo</text>
      <text x="20" y="395" fontFamily="var(--font-geist-mono), monospace" fontSize="7" fill="#8A8A82">ESCALA APROX. 1:3 · HOLGURA +40mm LARGO, +20mm ANCHO, +60mm ALTO INCLUIDA</text>
    </svg>
  );
}

function EnergySVG() {
  return (
    <svg viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg" className="block h-auto w-full" aria-label="Consumo energético del cooler Alpicool con EcoFlow 800Wh">
      <rect width="680" height="380" fill="#FAF7F0" />
      <g stroke="#e8e4dc" strokeWidth="0.5" opacity="0.5">
        {Array.from({ length: 9 }).map((_, i) => <line key={`h${i}`} x1="0" y1={40 * (i + 1)} x2="680" y2={40 * (i + 1)} />)}
        {Array.from({ length: 5 }).map((_, i) => <line key={`v${i}`} x1={120 * (i + 1)} y1="0" x2={120 * (i + 1)} y2="380" />)}
      </g>

      <text x="340" y="28" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fontWeight="600" fill="#8A8A82" letterSpacing="3">CONSUMO Y AUTONOMÍA — ECOFLOW 800 Wh</text>

      <rect x="40" y="48" width="600" height="36" rx="5" fill="#1A1D17" />
      <rect x="42" y="50" width="596" height="32" rx="4" fill="#1F4F38" />
      <rect x="42" y="50" width="596" height="32" rx="4" fill="#5fb360" opacity="0.18" />
      <rect x="42" y="50" width="596" height="32" rx="4" fill="none" stroke="#5fb360" strokeWidth="1" opacity="0.3" />
      <text x="340" y="71" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="#5fb360" fontWeight="600">ECOFLOW 800 Wh — CARGA COMPLETA</text>

      <text x="44" y="110" fontFamily="var(--font-geist-sans), sans-serif" fontSize="11" fontWeight="600" fill="#1A1D17" letterSpacing="1">COOLER X18 (35W PICO · 14 Wh/h EFECTIVO)</text>
      <rect x="44" y="116" width="600" height="22" rx="3" fill="rgba(58,127,193,0.1)" stroke="#3a7fc1" strokeWidth="1" />
      <rect x="44" y="116" width="420" height="22" rx="3" fill="#3a7fc1" opacity="0.7" />
      <text x="470" y="131" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#3a7fc1" fontWeight="600">~57 h</text>
      <text x="44" y="150" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fill="#8A8A82" letterSpacing="1">El compresor cicla aprox. 40% del tiempo. Consumo real ≈ 14 Wh/h</text>

      <text x="44" y="178" fontFamily="var(--font-geist-sans), sans-serif" fontSize="11" fontWeight="600" fill="#1A1D17" letterSpacing="1">COOLER X30 (35W PICO · 14 Wh/h EFECTIVO)</text>
      <rect x="44" y="184" width="600" height="22" rx="3" fill="rgba(58,127,193,0.1)" stroke="#3a7fc1" strokeWidth="1" />
      <rect x="44" y="184" width="420" height="22" rx="3" fill="#3a7fc1" opacity="0.5" />
      <text x="470" y="199" fontFamily="var(--font-geist-mono), monospace" fontSize="9" fill="#3a7fc1" fontWeight="600">~57 h</text>
      <text x="44" y="218" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fill="#8A8A82" letterSpacing="1">Mismo consumo declarado en ambos modelos (35W)</text>

      <text x="44" y="246" fontFamily="var(--font-geist-sans), sans-serif" fontSize="11" fontWeight="600" fill="#1A1D17" letterSpacing="1">BOMBA AGUA (10W · USO PUNTUAL ~5 min/día)</text>
      <rect x="44" y="252" width="600" height="22" rx="3" fill="rgba(184,118,58,0.08)" stroke="#B8763A" strokeWidth="1" />
      <rect x="44" y="252" width="36" height="22" rx="3" fill="#B8763A" opacity="0.6" />
      <text x="85" y="267" fontFamily="var(--font-geist-mono), monospace" fontSize="8" fill="#B8763A">~0.8 Wh/día</text>
      <text x="44" y="286" fontFamily="var(--font-geist-sans), sans-serif" fontSize="10" fill="#8A8A82" letterSpacing="1">Impacto despreciable sobre la batería</text>

      <rect x="40" y="300" width="600" height="68" rx="4" fill="#1A1D17" />
      <text x="340" y="320" textAnchor="middle" fontFamily="var(--font-geist-sans), sans-serif" fontSize="13" fontWeight="600" fill="#B8763A" letterSpacing="3">RESUMEN AUTONOMÍA</text>
      <text x="180" y="344" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="white">SOLO COOLER:</text>
      <text x="180" y="358" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="12" fill="#5fb360" fontWeight="600">~57 h</text>
      <text x="340" y="344" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="white">COOLER + BOMBA:</text>
      <text x="340" y="358" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="12" fill="#5fb360" fontWeight="600">~56 h</text>
      <text x="510" y="344" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="10" fill="white">CON PANEL SOLAR:</text>
      <text x="510" y="358" textAnchor="middle" fontFamily="var(--font-geist-mono), monospace" fontSize="12" fill="#B8763A" fontWeight="600">INDEFINIDO</text>
    </svg>
  );
}
