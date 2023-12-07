"use client";

export type InputProps = Omit<JSX.IntrinsicElements["input"], "onChange"> & {
  label?: string;
  onChange: (value: any) => void;
};

export function Input({ type, label, value, placeholder, onChange, ...props }: InputProps) {
  const handleChange: JSX.IntrinsicElements["input"]["onChange"] = event => {
    const value = type === "file" ? event.target.files : event.target.value;
    onChange?.(value);
  };

  return (
    <label className="w-full">
      {label && <span className="mb-2 inline-block">{label}</span>}
      <input
        {...props}
        type={type}
        className="w-full rounded border px-4 py-2"
        value={value}
        placeholder={placeholder || (label ? `Enter ${label.toLowerCase()}` : "")}
        onChange={handleChange}
      />
    </label>
  );
}
