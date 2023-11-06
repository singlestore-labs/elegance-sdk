import type {
  Connection,
  CreateAndInsertFileEmbeddingsBody,
  CreateAndInsertFileEmbeddingsResult
} from "../../shared/types";
import type { OpenAI } from "../utils";
import { handleError } from "../../shared/helpers";
import { createController, getTablePath } from "../utils";

export const createCreateAndInsertFileEmbeddingsController = <T extends Connection>(connection: T, openai: OpenAI) => {
  return createController({
    name: "createAndInsertFileEmbeddings",
    method: "POST",
    execute: async (
      body: CreateAndInsertFileEmbeddingsBody[T["type"]]
    ): Promise<CreateAndInsertFileEmbeddingsResult> => {
      try {
        if (!openai) throw new Error("OpenAI client is undefined");

        const { dataURL, chunkSize = 1000, textField = "text", embeddingField = "embedding" } = body;
        const fileEmbeddings = await openai?.helpers.dataURLtoEmbeddings(dataURL, {
          chunkSize,
          textField,
          embeddingField
        });

        if (connection.type === "kai") {
          const { collection } = body as CreateAndInsertFileEmbeddingsBody["kai"];

          await connection.db.dropCollection(collection);
          await connection.db.createCollection(collection, {
            columns: [{ id: embeddingField, type: "LONGBLOB NOT NULL" }]
          } as any);

          const fileBufferEmbeddings = fileEmbeddings.map(i => ({
            [textField]: i[textField as keyof typeof i],
            [embeddingField]: openai?.helpers.embeddingToBuffer(i[embeddingField as keyof typeof i] as number[])
          }));

          await connection.db.collection(collection).insertMany(fileBufferEmbeddings);
        } else {
          const { db, table } = body as CreateAndInsertFileEmbeddingsBody["mysql"];
          const tablePath = getTablePath(connection, table, db);

          await connection.promise().execute(`DROP TABLE IF EXISTS ${tablePath}`);
          await connection.promise().execute(`CREATE TABLE IF NOT EXISTS ${tablePath} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ${textField} TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
            ${embeddingField} BLOB
          )`);

          await connection.promise().execute(`TRUNCATE TABLE ${tablePath}`);

          for await (const i of fileEmbeddings) {
            await connection
              .promise()
              .execute(`INSERT INTO ${tablePath} (${textField}, ${embeddingField}) VALUES (?, JSON_ARRAY_PACK(?))`, [
                i[textField],
                JSON.stringify(i[embeddingField])
              ]);
          }
        }

        return fileEmbeddings as CreateAndInsertFileEmbeddingsResult;
      } catch (error) {
        throw handleError(error);
      }
    }
  });
};
