import type { CreateChatCompletionBody, CreateChatCompletionResult } from "../../shared/types";
import type { AI } from "../ai";
import { handleError } from "../../shared/helpers";

export const createChatCompletionController = (ai: AI) => {
  return async (body: CreateChatCompletionBody): Promise<CreateChatCompletionResult> => {
    try {
      return await ai.createChatCompletion(body);
    } catch (error) {
      throw handleError(error);
    }
  };
};
