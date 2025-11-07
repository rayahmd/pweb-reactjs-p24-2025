import type { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function InputField({
  label,
  error,
  className = "",
  ...props
}: InputFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
      {label}
      <input
        className={`rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-base font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${className}`}
        {...props}
      />
      {error ? <span className="text-xs font-normal text-rose-500">{error}</span> : null}
    </label>
  );
}
