import type { Connection, DeleteManyResult, DeleteManyBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";
import { createController } from "../utils";

export const createDeleteManyController = <T extends Connection>(connection: T) => {
  return createController({
    name: "deleteMany",
    method: "POST",
    execute: async <K extends any = any>(body: DeleteManyBody<K>[T["type"]]): Promise<DeleteManyResult> => {
      try {
        const { db, collection } = body;

        if (connection.type === "kai") {
          const { filter, options } = body as DeleteManyBody["kai"];
          await connection.db(db).collection(collection).deleteMany(filter, options);
        } else {
          const { where } = body as DeleteManyBody["mysql"];
          const tablePath = connection.tablePath(collection, db);
          await connection.query(`DELETE FROM ${tablePath} WHERE ${where}`);
        }

        return { message: "Records were deleted" };
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
