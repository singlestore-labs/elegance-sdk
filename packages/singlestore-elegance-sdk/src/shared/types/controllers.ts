import type {
  Filter as MongoFilter,
  UpdateFilter as MongoUpdateFilter,
  UpdateOptions as MongoUpdateOptions,
  DeleteOptions as MongoDeleteOptions,
  FindOptions as MongoFindOptions,
  BulkWriteOptions as MongoBulkWriteOptions,
  OptionalUnlessRequiredId as MongoOptionalUnlessRequiredId,
  InsertOneOptions as MongoInsertOneOptions,
  AggregateOptions as MongoAggregateOptions
} from "mongodb";

import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";

import type { CreateEmbedding, Embedding } from "./ai";

export type {
  MongoFilter,
  MongoUpdateFilter,
  MongoUpdateOptions,
  MongoDeleteOptions,
  MongoFindOptions,
  MongoBulkWriteOptions,
  MongoOptionalUnlessRequiredId,
  MongoInsertOneOptions,
  MongoAggregateOptions
};

export type AggregateQuery = Record<any, any>[];

export type MySQLWhere = string;
export type MySQLSet = string;

type WithDb<T extends object> = Omit<T, "db" | "collection"> & {
  db?: string;
  collection: string;
};

type ByConnection<T extends object, K extends object = object, M extends object = object> = {
  kai: WithDb<T & K>;
  mysql: WithDb<T & M>;
};

export type QueryResult = any[];
export type QueryBody = {
  kai: WithDb<{
    query: object[];
    options?: MongoAggregateOptions;
  }>;
  mysql: { query: string };
};

export type InsertOneResult<T = any> = T;
export type InsertOneBody<T extends InsertOneResult = InsertOneResult> = ByConnection<
  { generateId?: boolean },
  {
    value: MongoOptionalUnlessRequiredId<T>;
    options?: MongoInsertOneOptions;
  },
  { value: T }
>;

export type InsertManyResult<T extends any[] = any[]> = T;
export type InsertManyBody<T extends InsertManyResult = InsertManyResult> = ByConnection<
  { generateId?: boolean },
  {
    values: MongoOptionalUnlessRequiredId<T[number]>[];
    options?: MongoBulkWriteOptions;
  },
  { values: T }
>;

export type UpdateManyResult<T extends any[] = any[]> = T;
export type UpdateManyBody<T extends UpdateManyResult = UpdateManyResult> = ByConnection<
  {},
  {
    filter: MongoFilter<T[number]>;
    update: MongoUpdateFilter<T[number]>;
    options?: MongoUpdateOptions;
    updatedFilter?: MongoFilter<T[number]>;
  },
  {
    where: MySQLWhere;
    set: MySQLSet;
    updatedWhere?: MySQLWhere;
  }
>;

export type DeleteManyResult = { message: string };
export type DeleteManyBody<T extends any = any> = ByConnection<
  {},
  { filter: MongoFilter<T>; options?: MongoDeleteOptions },
  { where: MySQLWhere }
>;

export type FindOneResult<T = any> = T;
export type FindOneBody<T extends FindOneResult = FindOneResult> = ByConnection<
  {},
  { filter?: MongoFilter<T>; options?: MongoFindOptions },
  { columns?: string[]; where?: MySQLWhere }
>;

export type FindManyResult<T extends any[] = any[]> = T;
export type FindManyBody<T extends FindManyResult = FindManyResult> = ByConnection<
  {},
  { filter?: MongoFilter<T[number]>; options?: MongoFindOptions },
  { columns?: string[]; where?: MySQLWhere; skip?: number; limit?: number }
>;

export type CreateEmbeddingResult = ReturnType<CreateEmbedding>;
export type CreateEmbeddingBody = { input: Parameters<CreateEmbedding>[0] };

export type VectorSearchResult = any[];
export type VectorSearchBody = WithDb<{
  query: string;
  embeddingField: string;
  limit?: number;
  minSimilarity?: number;
  includeEmbedding?: boolean;
}>;

export type ChatCompletionResult = {
  content: string;
  context: string;
};
export type ChatCompletionBody = WithDb<
  {
    textField?: string;
    embeddingField?: string;
  } & Pick<
    CreateChatCompletionBody,
    "prompt" | "model" | "systemRole" | "messages" | "minSimilarity" | "maxTokens" | "maxContextLength" | "temperature"
  >
>;

export type CreateFileEmbeddingsResult = { text: string; embedding: Embedding }[];
export type CreateFileEmbeddingsBody = {
  dataURL: string;
  textField?: string;
  embeddingField?: string;
  chunkSize?: number;
};

export type CreateAndInsertFileEmbeddingsResult = { text: string; embedding: Embedding }[];
export type CreateAndInsertFileEmbeddingsBody = WithDb<{
  dataURL: string;
  textField?: string;
  embeddingField?: string;
  chunkSize?: number;
}>;

export type CreateChatCompletionResult = { content: string };
export type CreateChatCompletionBody = {
  systemRole?: string;
  prompt?: string;
  promptEmbedding?: Embedding;
  model?: string;
  temperature?: number;
  searchResults?: ({ similarity: number } & Record<string, any>)[];
  messages?: ChatCompletionCreateParamsNonStreaming["messages"];
  maxTokens?: number;
  maxContextLength?: number;
  minSimilarity?: number;
};
