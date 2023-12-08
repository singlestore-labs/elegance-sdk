import type { Connection, VectorSearchResult, VectorSearchBody, AggregateQuery } from "../../shared/types";
import type { AI } from "../ai";
import { handleError } from "../../shared/helpers";

export const createVectorSearchController = <T extends Connection>(connection: T, ai: AI) => {
  return async <R extends VectorSearchResult = VectorSearchResult>(body: VectorSearchBody): Promise<R> => {
    try {
      let result: any = undefined;

      const { db, collection, embeddingField, query, minSimilarity, limit, includeEmbedding = false } = body;

      const queryEmbedding = (await ai.createEmbedding(query))[0];

      if (connection.type === "kai") {
        const queryBuffer = ai.embeddingToBuffer(queryEmbedding);

        const query: AggregateQuery = [
          { $addFields: { similarity: { $dotProduct: [`$${embeddingField}`, queryBuffer] } } }
        ];

        if (!includeEmbedding) {
          query.push({ $project: { [embeddingField]: 0 } });
        }

        if (minSimilarity) {
          query.push({ $match: { similarity: { $gte: minSimilarity } } });
        }

        query.push({ $sort: { similarity: -1 } });

        if (limit) {
          query.push({ $limit: limit });
        }

        result = await connection.db(db).collection(collection).aggregate(query).toArray();
      } else {
        const tablePath = connection.tablePath(collection, db);

        let query = `
          SELECT *, DOT_PRODUCT(${embeddingField}, JSON_ARRAY_PACK('[${queryEmbedding}]')) AS similarity
          FROM ${tablePath}
          WHERE similarity > ${minSimilarity}
          ORDER BY similarity DESC
        `;

        if (limit) {
          query += ` LIMIT ${limit}`;
        }

        const _result = (await connection.execute(query))[0] as any[];

        if (!includeEmbedding) {
          result = _result.map(i => {
            delete i[embeddingField];
            return i;
          });
        } else {
          result = _result;
        }
      }

      return result;
    } catch (error) {
      throw handleError(error);
    }
  };
};
