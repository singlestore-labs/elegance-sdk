import { CreateEmbedding } from "../../shared/types";
import { splitText } from "../utils/helpers";

export function textToEmbeddings(createEmbedding: CreateEmbedding) {
  return async (text: string, options?: { chunkSize?: number; textField?: string; embeddingField?: string }) => {
    const { chunkSize = 1000, textField = "text", embeddingField = "embedding" } = options ?? {};
    const source = splitText(text, chunkSize);
    const embeddings = await createEmbedding(source);

    return embeddings.map((embedding, i) => ({
      [textField]: source[i],
      [embeddingField]: embedding
    }));
  };
}
