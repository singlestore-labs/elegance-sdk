import { ObjectId } from "mongodb";
import type { Connection, InsertOneResult, InsertOneBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";
import { toInsertValuesQuery } from "../utils/mysql";

export const createInsertOneController = <T extends Connection>(connection: T) => {
  return async <R extends InsertOneResult = InsertOneResult>(body: InsertOneBody<R>[T["type"]]): Promise<R> => {
    try {
      let result: any = undefined;
      const { db, collection, generateId = false } = body;

      if (connection.type === "kai") {
        const { value, options } = body as InsertOneBody["kai"];
        if (generateId) value.id = new ObjectId().toString();
        const inserted = await connection.db(db).collection(collection).insertOne(value, options);
        result = { id: inserted.insertedId.toString(), ...value };
      } else {
        const { db, value } = body as InsertOneBody["mysql"];
        const tablePath = connection.tablePath(collection, db);
        if (generateId) value.id = new ObjectId().toString();
        const { query, valuesToInsert } = toInsertValuesQuery(tablePath, value);
        await connection.query(query, [valuesToInsert]);
        result = value;
      }

      return result;
    } catch (error) {
      throw handleError(error);
    }
  };
};
