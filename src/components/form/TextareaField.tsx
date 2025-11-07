import type { TextareaHTMLAttributes } from "react";

interface TextareaFieldProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function TextareaField({
  label,
  error,
  className = "",
  ...props
}: TextareaFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
      {label}
      <textarea
        className={`rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-base font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs font-normal text-rose-500">{error}</span> : null}
    </label>
  );
}
