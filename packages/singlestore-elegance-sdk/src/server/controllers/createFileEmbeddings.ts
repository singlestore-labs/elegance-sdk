import type { CreateFileEmbeddingsBody, CreateFileEmbeddingsResult } from "../../shared/types";
import type { OpenAI } from "../utils";
import { handleError } from "../../shared/helpers";
import { createController } from "../utils";

export const createCreateFileEmbeddingsController = (openai: OpenAI) => {
  return createController({
    name: "createFileEmbeddings",
    method: "POST",
    execute: async (body: CreateFileEmbeddingsBody): Promise<CreateFileEmbeddingsResult> => {
      try {
        if (!openai) throw new Error("OpenAI client is undefined");
        if (!body.dataURL) throw new Error("dataURL is required field");

        const { dataURL, chunkSize = 1000, textField = "text", embeddingField = "embedding" } = body;
        const fileEmbeddings = await openai?.helpers.dataURLtoEmbeddings(dataURL, {
          chunkSize,
          textField,
          embeddingField
        });

        return fileEmbeddings as CreateFileEmbeddingsResult;
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
