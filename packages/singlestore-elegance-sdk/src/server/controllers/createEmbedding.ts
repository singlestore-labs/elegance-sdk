import type { CreateEmbeddingBody, CreateEmbeddingResult } from "../../shared/types";
import type { AI } from "../ai";
import { handleError } from "../../shared/helpers";

export const createEmbeddingController = (ai: AI) => {
  return async (body: CreateEmbeddingBody): Promise<CreateEmbeddingResult> => {
    try {
      return await ai.createEmbedding(body.input);
    } catch (error) {
      throw handleError(error);
    }
  };
};
