"use client";

import { useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const SUBJECTS = ["general", "product", "support", "other"] as const;
type Subject = (typeof SUBJECTS)[number];

const PayloadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  subject: z.enum(SUBJECTS),
  message: z.string().min(10).max(2000),
});

type Status = "idle" | "submitting" | "success" | "error";

type FieldErrors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const t = useTranslations("Contact.form");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<Subject>("general");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<
    "submitFailed" | "backendUnavailable" | null
  >(null);

  const validate = (): boolean => {
    const errors: FieldErrors = {};
    if (name.trim().length < 2) {
      errors.name = t("errors.nameRequired");
    }
    if (!z.string().email().safeParse(email).success) {
      errors.email = t("errors.emailInvalid");
    }
    if (message.trim().length < 10) {
      errors.message = t("errors.messageShort");
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    const payload = PayloadSchema.safeParse({ name, email, subject, message });
    if (!payload.success) return; // defensa: ya validado pero por las dudas

    setStatus("submitting");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.data),
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
      console.error("[contact] network error", err);
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
        <p className="mb-3 font-mono text-[10px] uppercase tracking-[3px] text-ochre">
          ✓
        </p>
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
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <Field
        id="contact-name"
        label={t("nameLabel")}
        error={fieldErrors.name}
      >
        <Input
          id="contact-name"
          type="text"
          autoComplete="name"
          placeholder={t("namePlaceholder")}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) {
              setFieldErrors({ ...fieldErrors, name: undefined });
            }
          }}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={
            fieldErrors.name ? "contact-name-error" : undefined
          }
        />
      </Field>

      <Field
        id="contact-email"
        label={t("emailLabel")}
        error={fieldErrors.email}
      >
        <Input
          id="contact-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors({ ...fieldErrors, email: undefined });
            }
          }}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={
            fieldErrors.email ? "contact-email-error" : undefined
          }
        />
      </Field>

      <Field id="contact-subject" label={t("subjectLabel")}>
        <select
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value as Subject)}
          className="w-full appearance-none rounded-lg border-[0.5px] border-green-deep/25 bg-cream-pure bg-[length:14px_14px] bg-[right_12px_center] bg-no-repeat px-3 py-[10px] pr-9 font-sans text-[13px] text-ink transition-colors focus:border-[1.5px] focus:border-green-deep focus:px-[11px] focus:py-[9px] focus:pr-[35px] focus:outline-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23B8763A' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 8 10 12 14 8'/></svg>\")",
          }}
        >
          {SUBJECTS.map((option) => (
            <option key={option} value={option}>
              {t(`subjectOptions.${option}`)}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id="contact-message"
        label={t("messageLabel")}
        error={fieldErrors.message}
      >
        <textarea
          id="contact-message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (fieldErrors.message) {
              setFieldErrors({ ...fieldErrors, message: undefined });
            }
          }}
          aria-invalid={!!fieldErrors.message}
          aria-describedby={
            fieldErrors.message ? "contact-message-error" : undefined
          }
          className="w-full rounded-lg border-[0.5px] border-green-deep/25 bg-cream-pure px-3 py-[10px] font-sans text-[13px] leading-[1.55] text-ink transition-colors placeholder:text-ink-mute focus:border-[1.5px] focus:border-green-deep focus:px-[11px] focus:py-[9px] focus:outline-none"
        />
      </Field>

      <div className="space-y-3 border-t-[0.5px] border-green-deep/10 pt-6">
        <Button
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting ? t("submitting") : t("submit")}
        </Button>
        {submitError ? (
          <p role="alert" className="font-sans text-[13px] text-ochre">
            {t(`errors.${submitError}`)}
          </p>
        ) : null}
      </div>
    </form>
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
  children: React.ReactNode;
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
