export function toDataURL(value: File | string, onDataURL?: (dataURL: string) => void) {
  if (typeof value === "string" && value.startsWith("data:")) {
    return onDataURL?.(value);
  }

  if (value instanceof File) {
    const reader = new FileReader();

    reader.onload = event => {
      onDataURL?.(event.target!.result as string);
    };

    reader.readAsDataURL(value);
  } else {
  }
}
