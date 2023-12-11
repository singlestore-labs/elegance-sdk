import { AIConfig, CreateEmbedding } from "../../shared/types";
import { createOpenAI } from "../services/openai";

export function createEmbedding(config: AIConfig["openai"]) {
  return (async input => {
    const openai = createOpenAI(config);

    let retries = 0;
    let _input = Array.isArray(input) ? input : [input];

    if (typeof _input[0] === "object") {
      _input = _input.map(i => JSON.stringify(i));
    }

    async function create(): ReturnType<CreateEmbedding> {
      try {
        const response = await openai.embeddings.create({ input: _input, model: "text-embedding-ada-002" });
        retries = 0;
        return response.data.map(({ embedding }) => embedding);
      } catch (error) {
        if (retries < 5) {
          console.error("An error occurred while creating an embedding. Retrying...");
          retries += 1;
          return create();
        } else {
          throw error;
        }
      }
    }

    return create();
  }) satisfies CreateEmbedding;
}
