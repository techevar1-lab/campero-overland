"use client";

import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { OptionCard } from "@/components/configurador/OptionCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import productosData from "@data/productos.json";

const COMPANY = ["solo", "couple", "kids", "group"] as const;
type Company = (typeof COMPANY)[number];

const SLEEP = ["inside", "outside", "both"] as const;
type Sleep = (typeof SLEEP)[number];

type RequestType = "modify" | "custom";
type Status = "idle" | "submitting" | "success" | "error";

type FieldKey =
  | "vehicle"
  | "year"
  | "type"
  | "modifyModel"
  | "modifyChanges"
  | "company"
  | "sleep"
  | "name"
  | "email";

type FieldErrors = Partial<Record<FieldKey, string>>;

const MODELS = productosData.products.map((p) => ({
  id: p.id,
  title: p.title,
}));

export function CustomDesignForm() {
  const t = useTranslations("CustomDesign.form");

  // Prefill desde el configurador (ej. /a-medida?from=configurador&type=modify&model=j3_org).
  const searchParams = useSearchParams();
  const source = searchParams.get("from") ?? undefined;

  const [vehicle, setVehicle] = useState("");
  const [year, setYear] = useState("");
  const [requestType, setRequestType] = useState<RequestType | null>(
    searchParams.get("type") === "modify" ? "modify" : null,
  );

  const [modifyModel, setModifyModel] = useState(() => {
    const model = searchParams.get("model");
    return model && MODELS.some((m) => m.id === model) ? model : "";
  });
  const [modifyChanges, setModifyChanges] = useState("");

  const [company, setCompany] = useState<Company[]>([]);
  const [kidsAges, setKidsAges] = useState("");
  const [sleep, setSleep] = useState<Sleep | null>(null);
  const [elements, setElements] = useState("");
  const [notes, setNotes] = useState("");

  const [wantsMeeting, setWantsMeeting] = useState(false);
  const [availability, setAvailability] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, queda vacío para humanos

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<
    "submitFailed" | "backendUnavailable" | null
  >(null);

  const clearError = (key: FieldKey) => {
    setFieldErrors((prev) =>
      prev[key] ? { ...prev, [key]: undefined } : prev,
    );
  };

  const toggleCompany = (value: Company) => {
    setCompany((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value],
    );
    clearError("company");
  };

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (vehicle.trim().length < 2) errors.vehicle = t("errors.vehicleRequired");
    if (year.trim().length < 1) errors.year = t("errors.yearRequired");
    if (requestType === null) {
      errors.type = t("errors.typeRequired");
    } else if (requestType === "modify") {
      if (!modifyModel) errors.modifyModel = t("errors.modifyModelRequired");
      if (modifyChanges.trim().length < 10)
        errors.modifyChanges = t("errors.modifyChangesShort");
    } else {
      if (company.length < 1) errors.company = t("errors.companyRequired");
      if (sleep === null) errors.sleep = t("errors.sleepRequired");
    }
    if (name.trim().length < 2) errors.name = t("errors.nameRequired");
    if (!z.string().email().safeParse(email).success)
      errors.email = t("errors.emailInvalid");

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    if (!validate() || requestType === null) return;

    const payload =
      requestType === "modify"
        ? {
            vehicle,
            year,
            requestType,
            source,
            modifyModel,
            modifyChanges,
            wantsMeeting,
            availability: availability || undefined,
            name,
            email,
            phone: phone || undefined,
            website: website || undefined,
          }
        : {
            vehicle,
            year,
            requestType,
            source,
            company,
            kidsAges: kidsAges || undefined,
            sleep: sleep ?? undefined,
            elements: elements || undefined,
            notes: notes || undefined,
            wantsMeeting,
            availability: availability || undefined,
            name,
            email,
            phone: phone || undefined,
            website: website || undefined,
          };

    setStatus("submitting");
    try {
      const response = await fetch("/api/custom-design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 503) {
        setSubmitError("backendUnavailable");
        setStatus("error");
        return;
      }
      if (!response.ok) {
        setSubmitError("submitFailed");
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch (err) {
      console.error("[custom-design] network error", err);
      setSubmitError("submitFailed");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div
        role="status"
        className="rounded-sm border-[0.5px] border-green-deep/15 bg-cream-pure p-8 sm:p-10"
      >
        <Check
          aria-hidden
          width={22}
          height={22}
          strokeWidth={1.6}
          className="mb-3 text-ochre"
        />
        <h2 className="mb-3 font-serif text-2xl leading-[1.2] text-green-deep">
          {t("success.title")}
        </h2>
        <p className="font-sans text-sm leading-[1.6] text-ink-soft">
          {t("success.body")}
        </p>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-10">
      {/* Honeypot anti-spam: fuera de la vista y del tab order. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor="cd-website">Sitio web (no completar)</label>
        <input
          id="cd-website"
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* VEHÍCULO */}
      <fieldset className="space-y-5">
        <SectionTitle>{t("vehicleSection")}</SectionTitle>
        <Field id="cd-vehicle" label={t("vehicleLabel")} error={fieldErrors.vehicle}>
          <Input
            id="cd-vehicle"
            type="text"
            placeholder={t("vehiclePlaceholder")}
            value={vehicle}
            onChange={(e) => {
              setVehicle(e.target.value);
              clearError("vehicle");
            }}
            aria-invalid={!!fieldErrors.vehicle}
          />
        </Field>
        <Field id="cd-year" label={t("yearLabel")} error={fieldErrors.year}>
          <Input
            id="cd-year"
            type="text"
            inputMode="numeric"
            placeholder={t("yearPlaceholder")}
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
              clearError("year");
            }}
            aria-invalid={!!fieldErrors.year}
            className="max-w-[160px]"
          />
        </Field>
      </fieldset>

      {/* TIPO */}
      <fieldset className="space-y-4">
        <SectionTitle>{t("typeSection")}</SectionTitle>
        <div role="radiogroup" aria-label={t("typeSection")} className="flex flex-col gap-2">
          <OptionCard
            title={t("typeModifyTitle")}
            subtitle={t("typeModifyHelper")}
            selected={requestType === "modify"}
            onSelect={() => {
              setRequestType("modify");
              clearError("type");
            }}
          />
          <OptionCard
            title={t("typeCustomTitle")}
            subtitle={t("typeCustomHelper")}
            selected={requestType === "custom"}
            onSelect={() => {
              setRequestType("custom");
              clearError("type");
            }}
          />
        </div>
        {fieldErrors.type ? <ErrorLine>{fieldErrors.type}</ErrorLine> : null}
      </fieldset>

      {/* RAMA: MODIFICAR */}
      {requestType === "modify" ? (
        <fieldset className="space-y-5">
          <Field
            id="cd-model"
            label={t("modifyModelLabel")}
            error={fieldErrors.modifyModel}
          >
            <Select
              id="cd-model"
              value={modifyModel}
              onChange={(value) => {
                setModifyModel(value);
                clearError("modifyModel");
              }}
              placeholder={t("modifyModelPlaceholder")}
              options={MODELS.map((m) => ({ value: m.id, label: m.title }))}
              invalid={!!fieldErrors.modifyModel}
            />
          </Field>
          <Field
            id="cd-changes"
            label={t("modifyChangesLabel")}
            error={fieldErrors.modifyChanges}
          >
            <Textarea
              id="cd-changes"
              placeholder={t("modifyChangesPlaceholder")}
              value={modifyChanges}
              onChange={(value) => {
                setModifyChanges(value);
                clearError("modifyChanges");
              }}
              invalid={!!fieldErrors.modifyChanges}
            />
          </Field>
        </fieldset>
      ) : null}

      {/* RAMA: A MEDIDA */}
      {requestType === "custom" ? (
        <fieldset className="space-y-5">
          <SectionTitle>{t("travelSection")}</SectionTitle>

          <div className="space-y-2">
            <FieldLabel>{t("companyLabel")}</FieldLabel>
            <p className="font-sans text-[12px] text-ink-soft">
              {t("companyHelper")}
            </p>
            <div className="flex flex-wrap gap-2">
              {COMPANY.map((c) => {
                const active = company.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleCompany(c)}
                    className={`rounded-sm border-[1.5px] px-3.5 py-2 font-sans text-[13px] transition-colors ${
                      active
                        ? "border-green-deep bg-green-deep text-cream"
                        : "border-line text-ink hover:border-green-deep"
                    }`}
                  >
                    {t(`company${capitalize(c)}` as never)}
                  </button>
                );
              })}
            </div>
            {fieldErrors.company ? (
              <ErrorLine>{fieldErrors.company}</ErrorLine>
            ) : null}
          </div>

          {company.includes("kids") ? (
            <Field id="cd-kids" label={t("kidsAgesLabel")}>
              <Input
                id="cd-kids"
                type="text"
                placeholder={t("kidsAgesPlaceholder")}
                value={kidsAges}
                onChange={(e) => setKidsAges(e.target.value)}
                className="max-w-[260px]"
              />
            </Field>
          ) : null}

          <div className="space-y-2">
            <FieldLabel>{t("sleepLabel")}</FieldLabel>
            <div
              role="radiogroup"
              aria-label={t("sleepLabel")}
              className="flex flex-wrap gap-2"
            >
              {SLEEP.map((s) => {
                const active = sleep === s;
                return (
                  <button
                    key={s}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => {
                      setSleep(s);
                      clearError("sleep");
                    }}
                    className={`rounded-sm border-[1.5px] px-3.5 py-2 font-sans text-[13px] transition-colors ${
                      active
                        ? "border-green-deep bg-green-deep text-cream"
                        : "border-line text-ink hover:border-green-deep"
                    }`}
                  >
                    {t(`sleep${capitalize(s)}` as never)}
                  </button>
                );
              })}
            </div>
            {fieldErrors.sleep ? <ErrorLine>{fieldErrors.sleep}</ErrorLine> : null}
          </div>

          <Field id="cd-elements" label={t("elementsLabel")}>
            <Textarea
              id="cd-elements"
              placeholder={t("elementsPlaceholder")}
              value={elements}
              onChange={setElements}
            />
          </Field>

          <Field id="cd-notes" label={t("notesLabel")}>
            <Textarea
              id="cd-notes"
              placeholder={t("notesPlaceholder")}
              value={notes}
              onChange={setNotes}
              rows={3}
            />
          </Field>
        </fieldset>
      ) : null}

      {/* REUNIÓN */}
      <fieldset className="space-y-4">
        <SectionTitle>{t("meetingSection")}</SectionTitle>
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={wantsMeeting}
            onChange={(e) => setWantsMeeting(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-green-deep"
          />
          <span>
            <span className="block font-sans text-[14px] text-green-deep">
              {t("meetingCheckbox")}
            </span>
            <span className="block font-sans text-[12px] text-ink-soft">
              {t("meetingHelper")}
            </span>
          </span>
        </label>
        {wantsMeeting ? (
          <Field id="cd-availability" label={t("availabilityLabel")}>
            <Input
              id="cd-availability"
              type="text"
              placeholder={t("availabilityPlaceholder")}
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            />
          </Field>
        ) : null}
      </fieldset>

      {/* DATOS */}
      <fieldset className="space-y-5">
        <SectionTitle>{t("contactSection")}</SectionTitle>
        <Field id="cd-name" label={t("nameLabel")} error={fieldErrors.name}>
          <Input
            id="cd-name"
            type="text"
            autoComplete="name"
            placeholder={t("namePlaceholder")}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
            aria-invalid={!!fieldErrors.name}
          />
        </Field>
        <Field id="cd-email" label={t("emailLabel")} error={fieldErrors.email}>
          <Input
            id="cd-email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder={t("emailPlaceholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            aria-invalid={!!fieldErrors.email}
          />
        </Field>
        <Field id="cd-phone" label={t("phoneLabel")}>
          <Input
            id="cd-phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder={t("phonePlaceholder")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="max-w-[260px]"
          />
        </Field>
      </fieldset>

      <div className="space-y-3 border-t-[0.5px] border-green-deep/10 pt-6">
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? t("submitting") : t("submit")}
        </Button>
        <p className="font-sans text-[12px] text-ink-soft">{t("disclaimer")}</p>
        {submitError ? (
          <p role="alert" className="font-sans text-[13px] text-ochre">
            {t(`errors.${submitError}`)}
          </p>
        ) : null}
      </div>
    </form>
  );
}

/* ============ helpers ============ */

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <legend className="font-mono text-[10px] uppercase tracking-[3px] text-ochre">
      {children}
    </legend>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[2px] text-ink-soft">
      {children}
    </p>
  );
}

function ErrorLine({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="font-sans text-[12px] text-ochre">
      {children}
    </p>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="block font-mono text-[10px] uppercase tracking-[2px] text-ink-soft"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className="font-sans text-[12px] text-ochre"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Select({
  id,
  value,
  onChange,
  options,
  placeholder,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  invalid?: boolean;
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid}
      className="w-full appearance-none rounded-lg border-[0.5px] border-green-deep/25 bg-cream-pure bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat px-3 py-[10px] pr-9 font-sans text-[13px] text-ink transition-colors focus:border-[1.5px] focus:border-green-deep focus:px-[11px] focus:py-[9px] focus:pr-[35px] focus:outline-none"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23B8763A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 8 10 12 14 8'/></svg>\")",
      }}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Textarea({
  id,
  value,
  onChange,
  placeholder,
  invalid,
  rows = 4,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  invalid?: boolean;
  rows?: number;
}) {
  return (
    <textarea
      id={id}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-invalid={invalid}
      className="w-full rounded-lg border-[0.5px] border-green-deep/25 bg-cream-pure px-3 py-[10px] font-sans text-[13px] leading-[1.55] text-ink transition-colors placeholder:text-ink-mute focus:border-[1.5px] focus:border-green-deep focus:px-[11px] focus:py-[9px] focus:outline-none"
    />
  );
}
