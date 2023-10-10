import { ObjectId } from "mongodb";
import type { Connection, InsertOneResult, InsertOneBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";
import { createController, toInsertValuesQuery } from "../utils";

export const createInsertOneController = <T extends Connection>(connection: T) => {
  return createController({
    name: "insertOne",
    method: "POST",
    execute: async <R extends InsertOneResult = InsertOneResult>(body: InsertOneBody<R>[T["type"]]): Promise<R> => {
      try {
        let result: any = undefined;
        const { generateId = false } = body;

        if (connection.type === "kai") {
          const { collection, value, options } = body as InsertOneBody["kai"];
          if (generateId) value.id = new ObjectId().toString();
          const inserted = await connection.db.collection(collection).insertOne(value, options);
          result = { id: inserted.insertedId.toString(), ...value };
        } else {
          const { table, value } = body as InsertOneBody["mysql"];
          if (generateId) value.id = new ObjectId().toString();
          const { query, valuesToInsert } = toInsertValuesQuery(table, value);
          await connection.promise().query(query, [valuesToInsert]);
          result = value;
        }

        return result;
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
