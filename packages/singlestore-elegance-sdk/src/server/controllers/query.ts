import type { Connection, QueryResult, QueryBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";
import { createController } from "../utils";

export const createQueryController = <T extends Connection>(connection: T) => {
  return createController({
    name: "query",
    method: "POST",
    execute: async <R extends QueryResult = QueryResult>(body: QueryBody[T["type"]]): Promise<R> => {
      try {
        let result: any = undefined;

        if (connection.type === "kai") {
          const { collection, pipeline, options } = body as QueryBody["kai"];
          result = await connection.db.collection(collection).aggregate(pipeline, options).toArray();
        } else {
          const { query } = body as QueryBody["mysql"];
          result = (await connection.promise().query(query))[0];
        }

        return result;
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
