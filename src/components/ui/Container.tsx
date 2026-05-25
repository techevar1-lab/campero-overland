import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Element to render. Defaults to <div>. */
  as?: "div" | "section" | "header" | "footer" | "main" | "article";
}

export function Container({
  as: Tag = "div",
  className,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full max-w-7xl px-6 sm:px-12 lg:px-20",
        className,
      )}
      {...props}
    />
  );
}
