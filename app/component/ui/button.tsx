import { ButtonHTMLAttributes } from "react";

export default function Button({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "bg-blue-600 text-white hover:bg-blue-700";
  const rounded = "rounded-full";
  const spacing = "px-6 py-2";
  const classes = `${base} ${rounded} ${spacing} ${className ?? ""}`.trim();

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
