"use client";

export type CheckboxProps = Omit<JSX.IntrinsicElements["input"], "value" | "onChange"> & {
  label?: string;
  value?: boolean;
  onChange: (value: boolean) => void;
};

export function Checkbox({ label, value, placeholder, onChange, ...props }: CheckboxProps) {
  return (
    <label className="flex w-full items-center gap-2">
      <input
        {...props}
        className="h-4 w-4"
        type="checkbox"
        checked={value}
        placeholder={placeholder || (label ? `Enter ${label.toLowerCase()}` : "")}
        onChange={event => onChange?.(event.target.checked)}
      />
      {label && <span>{label}</span>}
    </label>
  );
}
