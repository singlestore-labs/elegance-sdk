export function getDataURLFileType(dataURL: string): "pdf" | "csv" {
  const mimeToExtension = {
    "text/csv": "csv",
    "application/pdf": "pdf"
  } as const;

  const mimeType = dataURL.split(";base64,")[0].split(":")[1];
  return mimeToExtension[mimeType as keyof typeof mimeToExtension];
}

export function decodeDataURL(dataURL: string) {
  const type = getDataURLFileType(dataURL);
  const base64 = dataURL.split(",")[1];
  const buffer = Buffer.from(base64, "base64");

  return { type, base64, buffer };
}
