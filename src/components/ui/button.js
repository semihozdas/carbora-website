import React from "react";
import { cn } from "../../utils/cn";

const VARIANTS = {
  default:
    "bg-primary text-background-dark hover:bg-primary-hover shadow-neon-sm",
  outline:
    "border border-white/20 bg-transparent text-white hover:bg-white/10",
  ghost: "bg-transparent text-white hover:bg-white/10",
};

const SIZES = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8 px-3 text-xs",
  lg: "h-11 px-6 text-sm",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-extrabold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50",
        VARIANTS[variant] || VARIANTS.default,
        SIZES[size] || SIZES.default,
        className
      )}
      {...props}
    />
  );
}

