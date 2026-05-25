import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type LabelProps = HTMLAttributes<HTMLSpanElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <span
      className={cn(
        "inline-block font-mono text-[10px] font-medium uppercase tracking-[2.5px] text-ochre",
        className,
      )}
      {...props}
    />
  );
}
