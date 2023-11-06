import type { CreateFileEmbeddingsBody, CreateFileEmbeddingsResult } from "../../shared/types";
import type { AI } from "../utils";
import { handleError } from "../../shared/helpers";
import { createController } from "../utils";

export const createCreateFileEmbeddingsController = (ai: AI) => {
  return createController({
    name: "createFileEmbeddings",
    method: "POST",
    execute: async (body: CreateFileEmbeddingsBody): Promise<CreateFileEmbeddingsResult> => {
      try {
        if (!body.dataURL) throw new Error("dataURL is required field");

        const { dataURL, chunkSize = 1000, textField = "text", embeddingField = "embedding" } = body;
        const fileEmbeddings = await ai.dataURLtoEmbeddings(dataURL, {
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
