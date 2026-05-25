"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Card } from "@/components/ui/Card";

export interface OptionCardProps {
  title: string;
  subtitle?: string;
  selected?: boolean;
  badge?: ReactNode;
  onSelect?: () => void;
  className?: string;
}

export function OptionCard({
  title,
  subtitle,
  selected = false,
  badge,
  onSelect,
  className,
}: OptionCardProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.();
    }
  };

  return (
    <Card
      role="radio"
      aria-checked={selected}
      tabIndex={0}
      selected={selected}
      onClick={onSelect}
      onKeyDown={handleKeyDown}
      className={`flex cursor-pointer items-start justify-between gap-4 transition-colors hover:border-green-deep/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ochre ${className ?? ""}`}
    >
      <div className="flex-1">
        <p className="font-serif text-lg leading-[1.3] text-green-deep">
          {title}
        </p>
        {subtitle ? (
          <p className="mt-1 font-sans text-[13px] leading-[1.5] text-ink-soft">
            {subtitle}
          </p>
        ) : null}
      </div>
      {badge ? <div className="shrink-0">{badge}</div> : null}
    </Card>
  );
}
