"use client";

import { ConnectionTypes } from "@singlestore/elegance-sdk/types";

export function ConnectionTypeSelect({
  value,
  onChange
}: {
  value: ConnectionTypes;
  onChange: (value: ConnectionTypes) => void;
}) {
  return (
    <label className="w-full">
      <span className="mb-2 inline-block">Connection</span>
      <select
        name="connectionTypeValue"
        placeholder="Select connection type"
        value={value}
        onChange={e => onChange?.(e.target.value as ConnectionTypes)}
        className="w-full rounded border px-4 py-2 "
      >
        <option value="mysql">MySQL</option>
        <option value="kai">Kai</option>
      </select>
    </label>
  );
}
