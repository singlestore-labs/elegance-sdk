import type { CreateEmbeddingBody, CreateEmbeddingResult } from "../../shared/types";
import type { OpenAI } from "../utils";
import { handleError } from "../../shared/helpers";
import { createController } from "../utils";

export const createCreateEmbeddingController = (openai: OpenAI) => {
  return createController({
    name: "createEmbedding",
    method: "POST",
    execute: async (body: CreateEmbeddingBody): Promise<CreateEmbeddingResult> => {
      try {
        if (!openai) throw new Error("OpenAI client is undefined");
        if (!body.input) throw new Error("input is required field");
        return await openai?.helpers.createEmbedding(body.input);
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
