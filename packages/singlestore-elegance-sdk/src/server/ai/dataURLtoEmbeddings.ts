import { CreateEmbedding } from "../../shared/types";
import { csvStringToArray } from "../utils/csv";
import { decodeDataURL } from "../utils/dataURL";
import { splitText } from "../utils/helpers";
import { pdfBufferToString } from "../utils/pdf";

export function dataURLtoEmbeddings(createEmbedding: CreateEmbedding) {
  return async (dataURL: string, options: { chunkSize?: number; textField?: string; embeddingField?: string } = {}) => {
    const { chunkSize = 1000, textField = "text", embeddingField = "embedding" } = options;
    let source: string[] = [];
    const { type, buffer } = decodeDataURL(dataURL);

    if (type === "csv") {
      source = await csvStringToArray(buffer.toString("utf-8"));
    } else {
      source = splitText(await pdfBufferToString(buffer), chunkSize);
    }

    const embeddings = await createEmbedding(source);

    return embeddings.map((embedding, i) => ({
      [textField]: source[i],
      [embeddingField]: embedding
    }));
  };
}
