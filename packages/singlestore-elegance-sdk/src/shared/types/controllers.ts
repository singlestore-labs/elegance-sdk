import type {
  Filter as MongoFilter,
  UpdateFilter as MongoUpdateFilter,
  UpdateOptions as MongoUpdateOptions,
  DeleteOptions as MongoDeleteOptions,
  FindOptions as MongoFindOptions,
  BulkWriteOptions as MongoBulkWriteOptions,
  OptionalUnlessRequiredId as MongoOptionalUnlessRequiredId,
  InsertOneOptions as MongoInsertOneOptions,
  AggregateOptions as MongoAggregateOptions,
} from "mongodb";

import type {
  Embedding,
  CreateEmbeddingArgs,
  CreateChatCompletionArgs,
  CreateChatCompletionResult,
} from "./ai";

export type {
  MongoFilter,
  MongoUpdateFilter,
  MongoUpdateOptions,
  MongoDeleteOptions,
  MongoFindOptions,
  MongoBulkWriteOptions,
  MongoOptionalUnlessRequiredId,
  MongoInsertOneOptions,
  MongoAggregateOptions,
};

export type AggregateQuery = Record<any, any>[];

export type MySQLWhere = string;
export type MySQLSet = string;

type WithDb<T extends object> = Omit<T, "db" | "collection"> & {
  db?: string;
  collection: string;
};

type ByConnection<
  T extends object,
  K extends object = object,
  M extends object = object
> = {
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
export type InsertOneBody<T extends InsertOneResult = InsertOneResult> =
  ByConnection<
    { generateId?: boolean },
    {
      value: MongoOptionalUnlessRequiredId<T>;
      options?: MongoInsertOneOptions;
    },
    { value: T }
  >;

export type InsertManyResult<T extends any[] = any[]> = T;
export type InsertManyBody<T extends InsertManyResult = InsertManyResult> =
  ByConnection<
    { generateId?: boolean },
    {
      values: MongoOptionalUnlessRequiredId<T[number]>[];
      options?: MongoBulkWriteOptions;
    },
    { values: T }
  >;

export type UpdateManyResult<T extends any[] = any[]> = T;
export type UpdateManyBody<T extends UpdateManyResult = UpdateManyResult> =
  ByConnection<
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
  { columns?: string[]; where?: MySQLWhere; extra?: string }
>;

export type FindManyResult<T extends any[] = any[]> = T;
export type FindManyBody<T extends FindManyResult = FindManyResult> =
  ByConnection<
    {},
    { filter?: MongoFilter<T[number]>; options?: MongoFindOptions },
    {
      columns?: string[];
      where?: MySQLWhere;
      skip?: number;
      limit?: number;
      extra?: string;
    }
  >;

export type CreateEmbeddingBody = { input: CreateEmbeddingArgs[0] };

export type CreateFileEmbeddingsResult = {
  text: string;
  embedding: Embedding;
}[];
export type CreateFileEmbeddingsBody = {
  dataURL: string;
  textField?: string;
  embeddingField?: string;
  chunkSize?: number;
};

export type CreateAndInsertFileEmbeddingsResult = CreateFileEmbeddingsResult;
export type CreateAndInsertFileEmbeddingsBody =
  WithDb<CreateFileEmbeddingsBody>;

export type CreateChatCompletionBody = CreateChatCompletionArgs[0];

export type SearchChatCompletionResult = {
  content: CreateChatCompletionResult;
  context: string;
};
export type SearchChatCompletionBody = WithDb<
  {
    prompt: Exclude<CreateChatCompletionBody["prompt"], undefined>;
    textField?: string;
    embeddingField?: string;
    minSimilarity?: number;
    maxContextLength?: number;
  } & Omit<CreateChatCompletionBody, "prompt">
>;

export type DotProductSearchResult = any[];
export type DotProductSearchBody = WithDb<{
  query: string;
  queryEmbedding?: Embedding;
  embeddingField: string;
  limit?: number;
  minSimilarity?: number;
  includeEmbedding?: boolean;
}>;
