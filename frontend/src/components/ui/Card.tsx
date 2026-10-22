import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "rounded-lg p-5 transition-all duration-200",
        elevated ? "glass-panel-elevated" : "glass-panel",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div className={cn("flex items-center justify-between pb-3 mb-4 border-b border-nexora-border/60", className)} {...props}>
      {children}
    </div>
  );
};

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <h3 className={cn("text-sm font-semibold tracking-wider uppercase text-slate-200 flex items-center gap-2", className)} {...props}>
      {children}
    </h3>
  );
};
