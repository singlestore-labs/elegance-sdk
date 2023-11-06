import type { CreateEmbeddingBody, CreateEmbeddingResult } from "../../shared/types";
import type { AI } from "../utils";
import { handleError } from "../../shared/helpers";
import { createController } from "../utils";

export const createCreateEmbeddingController = (ai: AI) => {
  return createController({
    name: "createEmbedding",
    method: "POST",
    execute: async (body: CreateEmbeddingBody): Promise<CreateEmbeddingResult> => {
      try {
        if (!body.input) throw new Error("input is required field");
        return await ai.createEmbedding(body.input);
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
