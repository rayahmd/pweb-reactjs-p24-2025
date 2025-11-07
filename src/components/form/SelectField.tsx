import type { SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: Array<{ label: string; value: string | number }>;
}

export default function SelectField({
  label,
  error,
  options,
  className = "",
  ...props
}: SelectFieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
      {label}
      <select
        className={`rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-base font-normal text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs font-normal text-rose-500">{error}</span> : null}
    </label>
  );
}
