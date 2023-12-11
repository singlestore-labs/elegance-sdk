import { Embedding } from "../../shared/types";

export function embeddingToBuffer(embedding: Embedding) {
  const float32 = new Float32Array(embedding);
  return Buffer.from(new Uint8Array(float32.buffer));
}
