"use client";

export function CollectionOrTableField({
  connectionType,
  value,
  onChange
}: {
  connectionType: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="w-full ">
      <span className="mb-2 inline-block">{connectionType === "kai" ? "Collection" : "Table"}</span>
      <input
        value={value}
        onChange={event => onChange?.(event.target.value)}
        placeholder={`Enter ${connectionType === "kai" ? "collection" : "table"} name`}
        className="w-full rounded border px-4 py-2 "
      />
    </label>
  );
}
