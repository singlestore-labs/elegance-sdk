import pdf from "pdf-parse/lib/pdf-parse";

export async function pdfBufferToString(buffer: Buffer) {
  return (await pdf(buffer)).text;
}
