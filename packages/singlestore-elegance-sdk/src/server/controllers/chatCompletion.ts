import type {
  Connection,
  ChatCompletionBody,
  ChatCompletionResult,
  Pipeline,
  CreateChatCompletionBody
} from "../../shared/types";
import type { OpenAI } from "../utils";
import { handleError } from "../../shared/helpers";
import { createController, getTablePath } from "../utils";

export const createChatCompletionController = <T extends Connection>(connection: T, openai: OpenAI) => {
  return createController({
    name: "chatCompletion",
    method: "POST",
    execute: async (body: ChatCompletionBody[T["type"]]): Promise<ChatCompletionResult> => {
      try {
        if (!openai) throw new Error("OpenAI client is undefined");

        let result: ChatCompletionResult | undefined = undefined;

        const {
          prompt,
          model,
          textField = "text",
          embeddingField = "embedding",
          minSimilarity = 0.7,
          systemRole = "You are a helpful assistant.",
          messages: restMessages = [],
          maxTokens,
          maxContextLength,
          temperature
        } = body;

        if (!prompt) throw new Error("Prompt is required");

        const promptEmbedding = (await openai.helpers.createEmbedding(prompt))[0];
        let searchResults: any[] | undefined = undefined;

        if (connection.type === "kai") {
          const { collection } = body as ChatCompletionBody["kai"];

          const pipeline: Pipeline = [
            {
              $addFields: {
                similarity: { $dotProduct: [`$${embeddingField}`, openai.helpers.embeddingToBuffer(promptEmbedding)] }
              }
            },
            { $project: { [textField]: 1, similarity: 1 } },
            { $sort: { similarity: -1 } }
          ];

          searchResults = await connection.db.collection(collection).aggregate(pipeline).toArray();
        } else {
          const { db, table } = body as ChatCompletionBody["mysql"];
          const tablePath = getTablePath(connection, table, db);

          const query = `SELECT ${textField}, DOT_PRODUCT(${embeddingField}, JSON_ARRAY_PACK('[${promptEmbedding}]')) AS similarity FROM ${tablePath} ORDER BY similarity DESC`;

          searchResults = ((await connection.promise().execute(query))[0] as any[]).map(i => {
            delete i[embeddingField];
            return i;
          });
        }

        if (!searchResults) throw new Error("No search results");

        if (typeof minSimilarity === "number") {
          searchResults = searchResults.filter(({ similarity }) => similarity >= minSimilarity);
        }

        const context = [...searchResults]
          .map(i => i[textField])
          .join("\n")
          .slice(0, maxContextLength);

        let messages: CreateChatCompletionBody["messages"] = [{ role: "system", content: systemRole }];

        if (prompt) {
          messages.push({
            role: "user",
            content: `The user wrote: ${prompt}. The most similar context is: ${context}`
          });
        }

        messages = [...messages, ...restMessages];

        const content = await openai.helpers.createChatCompletion({
          model,
          messages,
          max_tokens: maxTokens,
          temperature
        });

        result = { content: content ?? "", context };

        return result;
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
