import React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "active"
  | "planned"
  | "critical"
  | "warning"
  | "info"
  | "neutral"
  | "cyan";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  active: "bg-emerald-950/70 text-emerald-400 border-emerald-800/80",
  planned: "bg-slate-900/80 text-slate-400 border-slate-700/60",
  critical: "bg-rose-950/70 text-rose-400 border-rose-800/80",
  warning: "bg-amber-950/70 text-amber-400 border-amber-700/80",
  info: "bg-sky-950/70 text-sky-400 border-sky-800/80",
  neutral: "bg-slate-800/60 text-slate-300 border-slate-700/50",
  cyan: "bg-cyan-950/70 text-cyan-300 border-cyan-800/80",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  children,
  className,
  ...props
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-medium tracking-wide border uppercase",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
