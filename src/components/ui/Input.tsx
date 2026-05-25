import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, type = "text", ...props }: InputProps) {
  return (
    <input
      type={type}
      className={cn(
        "w-full rounded-lg bg-cream-pure font-sans text-[13px] text-ink",
        "border-[0.5px] border-green-deep/25 px-3 py-[10px]",
        "transition-colors placeholder:text-ink-mute",
        "focus:border-[1.5px] focus:border-green-deep focus:px-[11px] focus:py-[9px] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
