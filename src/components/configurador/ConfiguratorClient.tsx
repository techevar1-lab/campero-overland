"use client";

import { PreviewPanel } from "@/components/configurador/PreviewPanel";
import { ProgressBar } from "@/components/configurador/ProgressBar";
import { StepNav } from "@/components/configurador/StepNav";
import { Step1Vehicle } from "@/components/configurador/steps/Step1Vehicle";
import { Step2UseMode } from "@/components/configurador/steps/Step2UseMode";
import { Step3Model } from "@/components/configurador/steps/Step3Model";
import { Step4Material } from "@/components/configurador/steps/Step4Material";
import { Step5Accessories } from "@/components/configurador/steps/Step5Accessories";
import { Step6Summary } from "@/components/configurador/steps/Step6Summary";
import { useConfigurator } from "@/lib/configurator/context";

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 0:
      return <Step1Vehicle />;
    case 1:
      return <Step2UseMode />;
    case 2:
      return <Step3Model />;
    case 3:
      return <Step4Material />;
    case 4:
      return <Step5Accessories />;
    case 5:
      return <Step6Summary />;
    default:
      return null;
  }
}

export function ConfiguratorClient() {
  const { state, dispatch, canGoNext, canGoBack } = useConfigurator();

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-10 sm:px-12 sm:py-14 lg:px-20">
      <ProgressBar currentStep={state.step + 1} />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_400px] lg:gap-12">
        <section className="order-2 lg:order-1">
          <StepContent step={state.step} />

          {/* Step 6 (index 5) maneja su propio nav: el botón Pagar reemplaza
              al Siguiente, y el Atrás vive dentro del bloque CTA. */}
          {state.step < 5 ? (
            <StepNav
              canGoBack={canGoBack}
              canGoNext={canGoNext}
              onBack={() => dispatch({ type: "GO_BACK" })}
              onNext={() => dispatch({ type: "GO_NEXT" })}
            />
          ) : null}
        </section>

        <div className="order-1 lg:sticky lg:top-8 lg:order-2 lg:self-start">
          <PreviewPanel />
        </div>
      </div>
    </div>
  );
}
