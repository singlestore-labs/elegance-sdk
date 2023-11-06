import type { Connection, DeleteManyResult, DeleteManyBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";
import { createController, getTablePath } from "../utils";

export const createDeleteManyController = <T extends Connection>(connection: T) => {
  return createController({
    name: "deleteMany",
    method: "POST",
    execute: async <K extends any = any>(body: DeleteManyBody<K>[T["type"]]): Promise<DeleteManyResult> => {
      try {
        if (connection.type === "kai") {
          const { collection, filter, options } = body as DeleteManyBody["kai"];
          await connection.db.collection(collection).deleteMany(filter, options);
        } else {
          const { db, table, where } = body as DeleteManyBody["mysql"];
          const tablePath = getTablePath(connection, table, db);
          await connection.promise().query(`DELETE FROM ${tablePath} WHERE ${where}`);
        }

        return { message: "Records were deleted" };
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
