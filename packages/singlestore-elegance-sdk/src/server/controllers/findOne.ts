import type { Connection, FindOneResult, FindOneBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";
import { createController } from "../utils";

export const createFindOneController = <T extends Connection>(connection: T) => {
  return createController({
    name: "findOne",
    method: "POST",
    execute: async <R extends FindOneResult = FindOneResult>(body: FindOneBody<R>[T["type"]]): Promise<R> => {
      try {
        let result: any = undefined;

        const { db, collection } = body;

        if (connection.type === "kai") {
          const { filter = {}, options } = body as FindOneBody["kai"];
          result = await connection.db(db).collection(collection).findOne(filter, options);
        } else {
          const { columns, where } = body as FindOneBody["mysql"];
          const tablePath = connection.tablePath(collection, db);
          let query = `SELECT`;

          if (columns) {
            query += ` ${columns.join(", ")}`;
          } else {
            query += " *";
          }

          query += ` FROM ${tablePath}`;

          if (where) query += ` WHERE ${where}`;
          query += ` LIMIT 1`;
          result = ((await connection.execute(query)) as any)?.[0]?.[0];
        }

        return result;
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
