import type { Connection, UpdateManyResult, UpdateManyBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";

export const updateManyController = <T extends Connection>(connection: T) => {
  return async <R extends UpdateManyResult = UpdateManyResult>(body: UpdateManyBody<R>[T["type"]]): Promise<R> => {
    try {
      let result: any = undefined;

      const { db, collection } = body;

      if (connection.type === "kai") {
        const { filter, update, options, updatedFilter } = body as UpdateManyBody["kai"];
        await connection.db(db).collection(collection).updateMany(filter, update, options);
        const updated = connection
          .db(db)
          .collection(collection)
          .find(updatedFilter ?? filter);
        result = await updated.toArray();
      } else {
        const { set, where, updatedWhere } = body as UpdateManyBody["mysql"];
        const tablePath = connection.tablePath(collection, db);

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
  };
};
