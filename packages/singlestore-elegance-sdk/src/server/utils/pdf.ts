export async function pdfBufferToString(buffer: Buffer) {
  const pdf = (await import("pdf-parse/lib/pdf-parse")).default;
  return (await pdf(buffer)).text;
}
