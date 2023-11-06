import { ObjectId } from "mongodb";
import type { Connection, InsertManyResult, InsertManyBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";
import { createController, getTablePath, toInsertValuesQuery } from "../utils";

export const createInsertManyController = <T extends Connection>(connection: T) => {
  return createController({
    name: "insertMany",
    method: "POST",
    execute: async <R extends InsertManyResult = InsertManyResult>(body: InsertManyBody<R>[T["type"]]): Promise<R> => {
      try {
        let result: any = undefined;
        const { generateId = false } = body;

        if (connection.type === "kai") {
          const { collection, values, options } = body as InsertManyBody["kai"];
          if (generateId) for (const value of values) value.id = new ObjectId().toString();
          const inserted = await connection.db.collection(collection).insertMany(values, options);
          result = values.map((value, i) => ({ id: inserted.insertedIds[i].toString(), ...value }));
        } else {
          const { db, table, values } = body as InsertManyBody["mysql"];
          const tablePath = getTablePath(connection, table, db);
          if (generateId) for (const value of values) value.id = new ObjectId().toString();
          const { query, valuesToInsert } = toInsertValuesQuery(tablePath, values);
          await connection.promise().query(query, [valuesToInsert]);
          result = values;
        }

        return result;
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
