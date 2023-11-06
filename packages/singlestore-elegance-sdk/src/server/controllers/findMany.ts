import type { Connection, FindManyResult, FindManyBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";
import { createController, getTablePath } from "../utils";

export const createFindManyController = <T extends Connection>(connection: T) => {
  return createController({
    name: "findMany",
    method: "POST",
    execute: async <R extends FindManyResult = FindManyResult>(body: FindManyBody<R>[T["type"]]): Promise<R> => {
      try {
        let result: any = undefined;

        if (connection.type === "kai") {
          const { collection, filter = {}, options } = body as FindManyBody["kai"];
          let _result = connection.db.collection(collection).find(filter, options);
          result = await _result.toArray();
        } else {
          const { db, table, columns, where, skip, limit } = body as FindManyBody["mysql"];
          const tablePath = getTablePath(connection, table, db);
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
          result = (await connection.promise().execute(query))[0];
        }

        return result;
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
