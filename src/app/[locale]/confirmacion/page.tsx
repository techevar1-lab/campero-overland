import { getTranslations, setRequestLocale } from "next-intl/server";
import { ResetConfiguratorOnMount } from "@/components/configurador/ResetConfiguratorOnMount";
import { Link } from "@/i18n/navigation";

type Status = "success" | "failure" | "pending";

function parseStatus(value: string | undefined): Status {
  if (value === "success" || value === "failure" || value === "pending") {
    return value;
  }
  return "pending";
}

export default async function ConfirmacionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; payment_id?: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { status: rawStatus } = await searchParams;
  const status = parseStatus(rawStatus);

  if (status === "success") {
    return <SuccessView />;
  }
  if (status === "failure") {
    return <FailureView />;
  }
  return <PendingView />;
}

async function SuccessView() {
  const t = await getTranslations("Confirmation.success");
  return (
    <section className="bg-cream">
      <ResetConfiguratorOnMount />
      <div className="mx-auto max-w-[640px] px-6 py-20 text-center sm:px-12 lg:px-20">
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
          Pago confirmado
        </p>
        <h1 className="mb-4 font-serif text-4xl leading-[1.15] tracking-[-0.5px] text-green-deep sm:text-[44px]">
          {t("title")}
        </h1>
        <p className="mb-6 font-sans text-[15px] leading-[1.6] text-ink-soft">
          {t("subtitle")}
        </p>
        <div className="space-y-3 border-t-[0.5px] border-green-deep/10 pt-6 text-left font-sans text-[14px] leading-[1.65] text-ink-soft">
          <p>{t("productionLine")}</p>
          <p>{t("shippingLine")}</p>
        </div>
        <Link
          href="/"
          className="mt-10 inline-flex items-center justify-center bg-green-deep px-8 py-4 font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-green-medium"
        >
          {t("backHome")}
        </Link>
      </div>
    </section>
  );
}

async function FailureView() {
  const t = await getTranslations("Confirmation.failure");
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[640px] px-6 py-20 text-center sm:px-12 lg:px-20">
        <h1 className="mb-4 font-serif text-4xl leading-[1.15] tracking-[-0.5px] text-green-deep">
          {t("title")}
        </h1>
        <p className="mb-8 font-sans text-[15px] leading-[1.6] text-ink-soft">
          {t("body")}
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/configurador"
            className="inline-flex items-center justify-center bg-ochre px-8 py-4 font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-ochre-dark"
          >
            {t("retry")}
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center border-[0.5px] border-green-deep/40 px-8 py-4 font-sans text-[13px] font-medium tracking-[0.5px] text-green-deep transition-colors hover:bg-green-deep/5"
          >
            {t("support")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function PendingView() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[640px] px-6 py-20 text-center sm:px-12 lg:px-20">
        <h1 className="mb-4 font-serif text-4xl leading-[1.15] tracking-[-0.5px] text-green-deep">
          Estamos verificando tu pago.
        </h1>
        <p className="mb-8 font-sans text-[15px] leading-[1.6] text-ink-soft">
          MercadoPago está procesando la transacción. Te avisamos por email
          apenas se confirme.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center bg-green-deep px-8 py-4 font-sans text-[13px] font-medium tracking-[0.5px] text-cream transition-colors hover:bg-green-medium"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}
