import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type BadgeVariant = "eco" | "premium" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  eco: "bg-green-medium text-cream",
  premium: "bg-ochre text-cream",
  neutral: "bg-green-deep/10 text-ink-soft",
};

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-block rounded-sm px-2 py-1 font-mono text-[9px] font-medium uppercase tracking-[2px]",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
