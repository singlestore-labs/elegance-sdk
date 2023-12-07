import type { Connection, UpdateManyResult, UpdateManyBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";
import { createController } from "../utils";

export const createUpdateManyController = <T extends Connection>(connection: T) => {
  return createController({
    name: "updateMany",
    method: "POST",
    execute: async <R extends UpdateManyResult = UpdateManyResult>(body: UpdateManyBody<R>[T["type"]]): Promise<R> => {
      try {
        let result: any = undefined;

        if (connection.type === "kai") {
          const { collection, filter, update, options, updatedFilter } = body as UpdateManyBody["kai"];
          await connection.db().collection(collection).updateMany(filter, update, options);
          const updated = connection
            .db()
            .collection(collection)
            .find(updatedFilter ?? filter);
          result = await updated.toArray();
        } else {
          const { db, table, set, where, updatedWhere } = body as UpdateManyBody["mysql"];
          const tablePath = connection.tablePath(table, db);

          await connection.execute(`UPDATE ${tablePath} SET ${set} WHERE ${where}`);

          if (updatedWhere) {
            const updated = await connection.execute(`SELECT * FROM ${tablePath} WHERE ${updatedWhere}`);

            result = updated?.[0];
          }
        }

        return result;
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
