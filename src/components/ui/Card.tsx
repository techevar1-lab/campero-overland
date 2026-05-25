import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean;
  size?: "sm" | "md";
}

export function Card({
  selected = false,
  size = "md",
  className,
  ...props
}: CardProps) {
  return (
    <div
      data-selected={selected || undefined}
      className={cn(
        "rounded-sm bg-cream-pure transition-colors",
        size === "md" ? "px-7 py-8" : "p-4",
        selected
          ? "border-2 border-green-deep bg-ochre/[0.06]"
          : "border-[0.5px] border-green-deep/10",
        size === "md" && selected && "px-[27px] py-[31px]",
        className,
      )}
      {...props}
    />
  );
}
