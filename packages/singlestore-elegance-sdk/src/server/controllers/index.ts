import type { Connection } from "../../shared/types";
import { OpenAI } from "../utils";
import { createCreateAndInsertFileEmbeddingsController } from "./createAndInsertFileEmbeddings";
import { createFindManyController } from "./findMany";
import { createFindOneController } from "./findOne";
import { createInsertOneController } from "./insertOne";
import { createQueryController } from "./query";
import { createVectorSearchController } from "./vectorSearch";
import { createChatCompletionController } from "./chatCompletion";
import { createInsertManyController } from "./insertMany";
import { createUpdateManyController } from "./updateMany";
import { createDeleteManyController } from "./deleteMany";
import { createCreateEmbeddingController } from "./createEmbedding";
import { createCreateFileEmbeddingsController } from "./createFileEmbeddings";

export function createControllers<T extends Connection>(connection: T, openai?: OpenAI) {
  return {
    insertOne: createInsertOneController(connection),
    insertMany: createInsertManyController(connection),
    updateMany: createUpdateManyController(connection),
    deleteMany: createDeleteManyController(connection),
    findOne: createFindOneController(connection),
    findMany: createFindManyController(connection),
    query: createQueryController(connection),
    createEmbedding: createCreateEmbeddingController(openai),
    createFileEmbeddings: createCreateFileEmbeddingsController(openai),
    createAndInsertFileEmbeddings: createCreateAndInsertFileEmbeddingsController(connection, openai),
    vectorSearch: createVectorSearchController(connection, openai),
    chatCompletion: createChatCompletionController(connection, openai)
  };
}
