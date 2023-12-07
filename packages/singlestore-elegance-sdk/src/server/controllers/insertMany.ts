import { ObjectId } from "mongodb";
import type { Connection, InsertManyResult, InsertManyBody } from "../../shared/types";
import { handleError } from "../../shared/helpers";
import { toInsertValuesQuery } from "../utils";

export const createInsertManyController = <T extends Connection>(connection: T) => {
  return async <R extends InsertManyResult = InsertManyResult>(body: InsertManyBody<R>[T["type"]]): Promise<R> => {
    try {
      let result: any = undefined;
      const { db, collection, generateId = false } = body;

      if (connection.type === "kai") {
        const { values, options } = body as InsertManyBody["kai"];
        if (generateId) for (const value of values) value.id = new ObjectId().toString();
        const inserted = await connection.db(db).collection(collection).insertMany(values, options);
        result = values.map((value, i) => ({ id: inserted.insertedIds[i].toString(), ...value }));
      } else {
        const { values } = body as InsertManyBody["mysql"];
        const tablePath = connection.tablePath(collection, db);
        if (generateId) for (const value of values) value.id = new ObjectId().toString();
        const { query, valuesToInsert } = toInsertValuesQuery(tablePath, values);
        await connection.query(query, [valuesToInsert]);
        result = values;
      }

      return result;
    } catch (error) {
      throw handleError(error);
    }
  };
};
