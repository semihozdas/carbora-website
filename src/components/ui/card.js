import React from "react";
import { cn } from "../../utils/cn";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-card-dark/80 text-white shadow-sm backdrop-blur",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col space-y-1.5 p-4", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <div
      role="heading"
      aria-level={3}
      className={cn("text-sm font-extrabold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("p-4 pt-0", className)} {...props} />;
}

