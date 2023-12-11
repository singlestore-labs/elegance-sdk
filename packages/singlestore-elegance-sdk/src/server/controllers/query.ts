import type { Connection, QueryResult, QueryBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";

export const queryController = <T extends Connection>(connection: T) => {
  return async <R extends QueryResult = QueryResult>(body: QueryBody[T["type"]]): Promise<R> => {
    try {
      let result: any = undefined;

      if (connection.type === "kai") {
        const { db, collection, query, options } = body as QueryBody["kai"];
        result = await connection.db(db).collection(collection).aggregate(query, options).toArray();
      } else {
        const { query } = body as QueryBody["mysql"];
        result = (await connection.query(query))[0];
      }

      return result;
    } catch (error) {
      throw handleError(error);
    }
  };
};
