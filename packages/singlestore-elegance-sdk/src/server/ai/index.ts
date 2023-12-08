import { AIConfig } from "../../shared/types";

import { createChatCompletion } from "./createChatCompletion";
import { createEmbedding } from "./createEmbedding";
import { dataURLtoEmbeddings } from "./dataURLtoEmbeddings";
import { embeddingToBuffer } from "./embeddingToBuffer";
import { textToEmbeddings } from "./textToEmbeddings";

export type AI = ReturnType<typeof createAI>;

export function createAI<T extends AIConfig = AIConfig>(config?: T) {
  const _createEmbedding = config?.customizers?.createEmbedding || createEmbedding(config?.openai);

  return {
    createChatCompletion: config?.customizers?.createChatCompletion || createChatCompletion(config?.openai),
    createEmbedding: _createEmbedding,
    dataURLtoEmbeddings: dataURLtoEmbeddings(_createEmbedding),
    embeddingToBuffer: embeddingToBuffer,
    textToEmbeddings: textToEmbeddings(_createEmbedding)
  };
}
