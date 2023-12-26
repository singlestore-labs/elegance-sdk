import type { Connection, FindManyResult, FindManyBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";

export const findManyController = <T extends Connection>(connection: T) => {
  return async <R extends FindManyResult = FindManyResult>(body: FindManyBody<R>[T["type"]]): Promise<R> => {
    try {
      let result: any = undefined;

      const { db, collection } = body;

      if (connection.type === "kai") {
        const { filter = {}, options } = body as FindManyBody["kai"];
        let _result = connection.db(db).collection(collection).find(filter, options);
        result = await _result.toArray();
      } else {
        const { columns, where, skip, limit, extra } = body as FindManyBody["mysql"];
        const tablePath = connection.tablePath(collection, db);
        let query = `SELECT`;

        if (columns) {
          query += ` ${columns.join(", ")}`;
        } else {
          query += " *";
        }

        query += ` FROM ${tablePath}`;

        if (where) query += ` WHERE ${where}`;
        if (limit) query += ` LIMIT ${limit}`;
        if (skip) query += ` OFFSET ${skip}`;
        if (extra) query += ` ${extra}`;
        result = (await connection.execute(query))[0];
      }

      return result;
    } catch (error) {
      throw handleError(error);
    }
  };
};
