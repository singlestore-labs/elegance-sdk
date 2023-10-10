"use client";

export function ConnectionTypeSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="w-full">
      <span className="mb-2 inline-block">Connection</span>
      <select
        name="connectionTypeValue"
        placeholder="Select connection type"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className="w-full rounded border px-4 py-2 "
      >
        <option value="kai">Kai</option>
        <option value="mysql">MySQL</option>
      </select>
    </label>
  );
}
