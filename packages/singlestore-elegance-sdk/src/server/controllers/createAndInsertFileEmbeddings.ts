import type {
  Connection,
  CreateAndInsertFileEmbeddingsBody,
  CreateAndInsertFileEmbeddingsResult
} from "../../shared/types";
import type { AI } from "../utils";
import { handleError } from "../../shared/helpers";

export const createCreateAndInsertFileEmbeddingsController = <T extends Connection>(connection: T, ai: AI) => {
  return async (body: CreateAndInsertFileEmbeddingsBody): Promise<CreateAndInsertFileEmbeddingsResult> => {
    try {
      const { db, collection, dataURL, chunkSize = 1000, textField = "text", embeddingField = "embedding" } = body;

      const fileEmbeddings = await ai.dataURLtoEmbeddings(dataURL, {
        chunkSize,
        textField,
        embeddingField
      });

      if (connection.type === "kai") {
        await connection.db(db).dropCollection(collection);
        await connection.db(db).createCollection(collection, {
          columns: [{ id: embeddingField, type: "LONGBLOB NOT NULL" }]
        } as any);

        const fileBufferEmbeddings = fileEmbeddings.map(i => ({
          [textField]: i[textField as keyof typeof i],
          [embeddingField]: ai.embeddingToBuffer(i[embeddingField as keyof typeof i] as number[])
        }));

        await connection.db(db).collection(collection).insertMany(fileBufferEmbeddings);
      } else {
        const tablePath = connection.tablePath(collection, db);

        await connection.execute(`DROP TABLE IF EXISTS ${tablePath}`);
        await connection.execute(`CREATE TABLE IF NOT EXISTS ${tablePath} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ${textField} TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
            ${embeddingField} BLOB
          )`);

        await connection.execute(`TRUNCATE TABLE ${tablePath}`);

        for await (const i of fileEmbeddings) {
          await connection.execute(
            `INSERT INTO ${tablePath} (${textField}, ${embeddingField}) VALUES (?, JSON_ARRAY_PACK(?))`,
            [i[textField], JSON.stringify(i[embeddingField])]
          );
        }
      }

      return fileEmbeddings as CreateAndInsertFileEmbeddingsResult;
    } catch (error) {
      throw handleError(error);
    }
  };
};
