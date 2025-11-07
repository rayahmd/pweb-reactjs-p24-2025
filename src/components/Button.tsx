import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500",
  secondary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900",
  ghost:
    "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50",
  danger:
    "bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-500",
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  loading,
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "rounded-xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <button
      className={`${base} ${variantStyles[variant]} ${className}`.trim()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Memproses..." : children}
    </button>
  );
}
