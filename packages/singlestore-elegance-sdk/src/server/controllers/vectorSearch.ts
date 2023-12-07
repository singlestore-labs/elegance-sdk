import type { Connection, VectorSearchResult, VectorSearchBody, Pipeline } from "../../shared/types";
import type { AI } from "../utils";
import { handleError } from "../../shared/helpers";
import { createController } from "../utils";

export const createVectorSearchController = <T extends Connection>(connection: T, ai: AI) => {
  return createController({
    name: "vectorSearch",
    method: "POST",
    execute: async <R extends VectorSearchResult = VectorSearchResult>(
      body: VectorSearchBody[T["type"]]
    ): Promise<R> => {
      try {
        let result: any = undefined;
        const { db, collection, embeddingField, query, limit } = body;
        const queryEmbedding = (await ai.createEmbedding(query))[0];

        if (connection.type === "kai") {
          const queryBuffer = ai.embeddingToBuffer(queryEmbedding);

          const pipeline: Pipeline = [
            { $addFields: { similarity: { $dotProduct: [`$${embeddingField}`, queryBuffer] } } },
            { $project: { [embeddingField]: 0 } },
            { $sort: { similarity: -1 } }
          ];

          if (limit) {
            pipeline.push({ $limit: limit });
          }

          result = await connection.db(db).collection(collection).aggregate(pipeline).toArray();
        } else {
          const tablePath = connection.tablePath(collection, db);
          let query = `SELECT *, DOT_PRODUCT(${embeddingField}, JSON_ARRAY_PACK('[${queryEmbedding}]')) AS similarity FROM ${tablePath} ORDER BY similarity DESC`;

          if (limit) {
            query += ` LIMIT ${limit}`;
          }

          result = ((await connection.execute(query))[0] as any[]).map(i => {
            delete i[embeddingField];
            return i;
          });
        }

        return result;
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
