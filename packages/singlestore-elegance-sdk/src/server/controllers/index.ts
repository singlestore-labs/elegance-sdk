import type { Connection } from "../../shared/types";
import type { AI } from "../ai";
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

export function createControllers<T extends Connection>(connection: T, ai: AI) {
  return {
    insertOne: createInsertOneController(connection),
    insertMany: createInsertManyController(connection),
    updateMany: createUpdateManyController(connection),
    deleteMany: createDeleteManyController(connection),
    findOne: createFindOneController(connection),
    findMany: createFindManyController(connection),
    query: createQueryController(connection),
    createEmbedding: createCreateEmbeddingController(ai),
    createFileEmbeddings: createCreateFileEmbeddingsController(ai),
    createAndInsertFileEmbeddings: createCreateAndInsertFileEmbeddingsController(connection, ai),
    vectorSearch: createVectorSearchController(connection, ai),
    chatCompletion: createChatCompletionController(connection, ai)
  };
}
