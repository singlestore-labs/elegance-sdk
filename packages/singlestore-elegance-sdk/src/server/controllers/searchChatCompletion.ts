import type {
  Connection,
  SearchChatCompletionBody,
  SearchChatCompletionResult,
  AggregateQuery
} from "../../shared/types";
import type { AI } from "../ai";
import { handleError } from "../../shared/helpers";

export const searchChatCompletionController = <T extends Connection>(connection: T, ai: AI) => {
  return async (body: SearchChatCompletionBody): Promise<SearchChatCompletionResult> => {
    try {
      let result: SearchChatCompletionResult | undefined = undefined;

      const {
        db,
        collection,
        prompt,
        textField = "text",
        embeddingField = "embedding",
        minSimilarity = 0,
        maxContextLength,
        ...restBody
      } = body;

      const promptEmbedding = (await ai.createEmbedding(prompt))[0];
      let searchResults: any[] | undefined = undefined;

      if (connection.type === "kai") {
        const queryBuffer = ai.embeddingToBuffer(promptEmbedding);

        const query: AggregateQuery = [
          { $addFields: { similarity: { $dotProduct: [`$${embeddingField}`, queryBuffer] } } }
        ];

        if (minSimilarity) {
          query.push({ $match: { similarity: { $gte: minSimilarity } } });
        }

        query.push({ $sort: { similarity: -1 } });

        searchResults = await connection.db(db).collection(collection).aggregate(query).toArray();
      } else {
        const tablePath = connection.tablePath(collection, db);

        let query = `
          SELECT *, DOT_PRODUCT(${embeddingField}, JSON_ARRAY_PACK('[${promptEmbedding}]')) AS similarity
          FROM ${tablePath}
          WHERE similarity > ${minSimilarity}
          ORDER BY similarity DESC
        `;

        searchResults = (await connection.execute(query))[0] as any[];
      }

      if (!searchResults) throw new Error("No search results");

      result = { content: "", context: "" };

      return result;
    } catch (error) {
      throw handleError(error);
    }
  };
};
