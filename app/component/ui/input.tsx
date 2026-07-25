import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-800">
        {label}
      </label>

      <input
        {...props}
        className="
          rounded-md
          bg-white/60
          text-gray-900
          placeholder-gray-500
          border border-white/40
          px-3 py-2
          focus:outline-none
          focus:ring-2 focus:ring-blue-500
          focus:border-blue-500
          backdrop-blur-md
        "
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
