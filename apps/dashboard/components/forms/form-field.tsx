"use client";

import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  name: string;
  type?: "text" | "number" | "date" | "select" | "textarea";
  value?: string | number;
  onChange?: (value: string) => void;
  options?: { label: string; value: string }[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  options,
  placeholder,
  required,
  className,
}: FormFieldProps) {
  const baseClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500";

  return (
    <div className={cn("space-y-1", className)}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={baseClass}
          required={required}
        >
          <option value="">Select...</option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={cn(baseClass, "min-h-[80px]")}
          placeholder={placeholder}
          required={required}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={baseClass}
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  );
}
