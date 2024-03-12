import type { Connection } from "../../shared/types";
import type { AI } from "../ai";
import { createChatCompletionController } from "./createChatCompletion";
import { createAndInsertFileEmbeddingsController } from "./createAndInsertFileEmbeddings";
import { createEmbeddingController } from "./createEmbedding";
import { createFileEmbeddingsController } from "./createFileEmbeddings";
import { deleteManyController } from "./deleteMany";
import { findManyController } from "./findMany";
import { findOneController } from "./findOne";
import { insertManyController } from "./insertMany";
import { insertOneController } from "./insertOne";
import { queryController } from "./query";
import { updateManyController } from "./updateMany";
import { dotProductSearchController } from "./dotProductSearch";
import { searchChatCompletionController } from "./searchChatCompletion";

export function createControllers<T extends Connection>(connection: T, ai: AI) {
  return {
    insertOne: insertOneController(connection),
    insertMany: insertManyController(connection),
    updateMany: updateManyController(connection),
    deleteMany: deleteManyController(connection),
    findOne: findOneController(connection),
    findMany: findManyController(connection),
    query: queryController(connection),
    createEmbedding: createEmbeddingController(ai),
    createFileEmbeddings: createFileEmbeddingsController(ai),
    createAndInsertFileEmbeddings: createAndInsertFileEmbeddingsController(
      connection,
      ai
    ),
    createChatCompletion: createChatCompletionController(ai),
    searchChatCompletion: searchChatCompletionController(connection, ai),
    dotProductSearch: dotProductSearchController(connection, ai),
  };
}
