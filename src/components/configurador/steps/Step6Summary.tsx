"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";
import { z } from "zod";
import { StepHeader } from "@/components/configurador/StepHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useConfigurator } from "@/lib/configurator/context";
import type { ConfiguratorTotals } from "@/lib/configurator/calculations";
import { getMaterial } from "@/lib/configurator/data";
import { formatPrice } from "@/lib/format";

const EmailSchema = z.string().email();

type CheckoutErrorKey = "backendUnavailable" | "network" | "generic";

export function Step6Summary() {
  const tStep = useTranslations("Configurator.step6");
  const tEmail = useTranslations("Configurator.email");
  const tNav = useTranslations("Configurator.nav");
  const tConfig = useTranslations("Configurator");

  const tCheckoutError = useTranslations("Configurator.checkoutError");
  const { state, dispatch, totals, canGoBack } = useConfigurator();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<CheckoutErrorKey | null>(
    null,
  );
  const [submitting, setSubmitting] = useState(false);

  if (!totals) {
    return (
      <>
        <StepHeader question={tStep("question")} helper={tStep("helper")} />
        <p className="font-sans text-sm text-ink-soft">
          Completa los pasos anteriores para ver el resumen.
        </p>
      </>
    );
  }

  const material = getMaterial(state.material);

  const handlePay = async () => {
    const result = EmailSchema.safeParse(state.email);
    if (!result.success) {
      setEmailError(tEmail("errorInvalid"));
      return;
    }
    setEmailError(null);
    setCheckoutError(null);

    if (!state.vehicle || !state.use || !state.model) {
      // El effective model puede resolver el `model` faltante, pero para
      // pagar exigimos confirmación explícita de los pasos anteriores.
      setCheckoutError("generic");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle: state.vehicle,
          use: state.use,
          model: state.model,
          material: state.material,
          addons: state.addons,
          email: state.email,
        }),
      });

      if (response.status === 503) {
        setCheckoutError("backendUnavailable");
        setSubmitting(false);
        return;
      }
      if (!response.ok) {
        setCheckoutError("generic");
        setSubmitting(false);
        return;
      }

      const data = (await response.json()) as { initPoint?: string };
      if (!data.initPoint) {
        setCheckoutError("generic");
        setSubmitting(false);
        return;
      }

      // Redirigir al checkout de MercadoPago. No reseteamos submitting:
      // la pestaña navega y el componente desaparece.
      window.location.href = data.initPoint;
    } catch (err) {
      console.error("[checkout] network error", err);
      setCheckoutError("network");
      setSubmitting(false);
    }
  };

  return (
    <>
      <StepHeader question={tStep("question")} helper={tStep("helper")} />

      <SummaryCard
        totals={totals}
        materialName={material.name}
        sectionLabels={{
          product: tStep("sectionProduct"),
          accessories: tStep("sectionAccessories"),
          specs: tStep("sectionSpecs"),
          shipping: tStep("sectionShipping"),
          total: tStep("totalLine"),
        }}
        materialLine={tStep("materialLine", { material: material.name })}
        weightLine={tStep("weightLine", { kg: totals.weightKg })}
        volumeLine={tStep("volumeLine", { liters: totals.volumeL })}
        shippingLine={tStep("shippingLine")}
      />

      <div className="mt-8 space-y-2">
        <label
          htmlFor="checkout-email"
          className="block font-mono text-[10px] uppercase tracking-[2px] text-ink-soft"
        >
          {tEmail("label")}
        </label>
        <Input
          id="checkout-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={tEmail("placeholder")}
          value={state.email}
          onChange={(event) => {
            dispatch({ type: "SET_EMAIL", email: event.target.value });
            if (emailError) setEmailError(null);
          }}
          aria-invalid={emailError !== null}
          aria-describedby={
            emailError ? "checkout-email-error" : "checkout-email-helper"
          }
        />
        {emailError ? (
          <p
            id="checkout-email-error"
            role="alert"
            className="font-sans text-[12px] text-ochre"
          >
            {emailError}
          </p>
        ) : (
          <p
            id="checkout-email-helper"
            className="font-sans text-[12px] text-ink-soft"
          >
            {tEmail("helper")}
          </p>
        )}
      </div>

      <nav className="mt-10 space-y-4 border-t-[0.5px] border-green-deep/10 pt-8">
        <Button
          variant="primary"
          onClick={handlePay}
          disabled={submitting}
          className="w-full py-4 text-[14px]"
        >
          {tNav("pay", { amount: formatPrice(totals.total) })}
        </Button>
        {checkoutError ? (
          <p
            role="alert"
            className="text-center font-sans text-[13px] text-ochre"
          >
            {tCheckoutError(checkoutError)}
          </p>
        ) : null}
        {canGoBack ? (
          <button
            type="button"
            onClick={() => dispatch({ type: "GO_BACK" })}
            className="block w-full font-sans text-[13px] text-ink-soft transition-colors hover:text-green-deep focus-visible:underline focus-visible:outline-none"
          >
            {tNav("back")}
          </button>
        ) : null}
      </nav>

      <p className="mt-6 text-center font-sans text-[11px] leading-[1.5] text-ink-soft">
        {tConfig("disclaimer")}
      </p>
    </>
  );
}

function SummaryCard({
  totals,
  materialName,
  sectionLabels,
  materialLine,
  weightLine,
  volumeLine,
  shippingLine,
}: {
  totals: ConfiguratorTotals;
  materialName: string;
  sectionLabels: {
    product: string;
    accessories: string;
    specs: string;
    shipping: string;
    total: string;
  };
  materialLine: string;
  weightLine: string;
  volumeLine: string;
  shippingLine: string;
}) {
  void materialName; // valor visible vía materialLine ya formateada
  const hasAddons = totals.selectedAddons.length > 0;

  return (
    <article className="mt-6 rounded-sm border-[0.5px] border-green-deep/15 bg-cream-pure">
      <Section label={sectionLabels.product}>
        <Row
          left={
            <>
              <p className="font-serif text-base leading-[1.3] text-green-deep">
                {totals.product.title}
              </p>
              <p className="mt-0.5 font-sans text-[13px] text-ink-soft">
                {materialLine}
              </p>
            </>
          }
          right={
            <span className="font-mono text-[13px] tracking-[0.5px] text-ochre">
              {formatPrice(totals.basePrice)}
            </span>
          }
        />
      </Section>

      {hasAddons ? (
        <Section label={sectionLabels.accessories}>
          <div className="space-y-2">
            {totals.selectedAddons.map((addon) => (
              <Row
                key={addon.id}
                left={
                  <p className="font-sans text-[13px] text-green-deep">
                    {addon.fullName}
                  </p>
                }
                right={
                  <span className="font-mono text-[13px] tracking-[0.5px] text-ochre">
                    {formatPrice({
                      amount: addon.price.amount,
                      currency: "CLP",
                    })}
                  </span>
                }
              />
            ))}
          </div>
        </Section>
      ) : null}

      <Section label={sectionLabels.specs}>
        <div className="space-y-1.5">
          <p className="font-sans text-[13px] text-ink-soft">{weightLine}</p>
          <p className="font-sans text-[13px] text-ink-soft">{volumeLine}</p>
        </div>
      </Section>

      <Section label={sectionLabels.shipping}>
        <Row
          left={
            <p className="font-sans text-[13px] text-green-deep">
              {shippingLine}
            </p>
          }
          right={
            <span className="font-mono text-[13px] tracking-[0.5px] text-ochre">
              {formatPrice(totals.shipping)}
            </span>
          }
        />
      </Section>

      <div className="flex items-baseline justify-between gap-3 border-t-[0.5px] border-green-deep/10 bg-ochre/[0.04] px-6 py-5">
        <span className="font-mono text-[10px] uppercase tracking-[2px] text-green-deep">
          {sectionLabels.total}
        </span>
        <span className="font-serif text-[24px] tracking-[-0.5px] text-ochre">
          {formatPrice(totals.total)}
        </span>
      </div>
    </article>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="border-b-[0.5px] border-green-deep/10 px-6 py-5 last:border-b-0">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[2px] text-ochre">
        {label}
      </p>
      {children}
    </div>
  );
}

function Row({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex-1">{left}</div>
      <div className="shrink-0">{right}</div>
    </div>
  );
}
