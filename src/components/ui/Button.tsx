import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const base =
  "inline-flex items-center justify-center font-sans font-medium text-[13px] tracking-[0.5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  primary:
    "px-8 py-[15px] rounded-none bg-ochre text-cream hover:bg-ochre-dark",
  secondary:
    "px-8 py-[15px] rounded-none bg-transparent text-ink border-[0.5px] border-current/50 hover:bg-current/5",
  ghost: "text-ink-soft hover:text-green-deep",
};

export function Button({
  variant = "primary",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, variants[variant], className)}
      {...props}
    />
  );
}
