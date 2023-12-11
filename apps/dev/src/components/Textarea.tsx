"use client";

export type TextareaProps = Omit<JSX.IntrinsicElements["textarea"], "onChange"> & {
  label?: string;
  onChange: (value: string) => void;
};

export function Textarea({ label, value, placeholder, onChange, ...props }: TextareaProps) {
  return (
    <label className="w-full">
      {label && <span className="mb-2 inline-block">{label}</span>}
      <textarea
        rows={5}
        placeholder={placeholder || (label ? `Enter ${label.toLowerCase()}` : "")}
        {...props}
        className="w-full rounded border px-4 py-2"
        value={value}
        onChange={event => onChange?.(event.target.value)}
      />
    </label>
  );
}
