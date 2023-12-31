export function splitText(text: string, chunkSize: number = 2000): string[] {
  if (text.length <= chunkSize) return [text];

  const words = text.split(" ");
  const chunks: string[] = [];
  let currentChunk = "";

  for (const word of words) {
    if (currentChunk.length + word.length + 1 <= chunkSize) {
      if (currentChunk.length > 0) currentChunk += " ";
      currentChunk += word;
    } else if (!currentChunk.length) {
      chunks.push(word);
    } else {
      chunks.push(currentChunk);
      currentChunk = "";
    }
  }

  return chunks;
}
