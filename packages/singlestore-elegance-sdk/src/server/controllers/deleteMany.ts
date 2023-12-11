import type { Connection, DeleteManyResult, DeleteManyBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";

export const deleteManyController = <T extends Connection>(connection: T) => {
  return async <K extends any = any>(body: DeleteManyBody<K>[T["type"]]): Promise<DeleteManyResult> => {
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
  };
};
