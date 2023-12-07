import type {
  MongoClientOptions,
  MongoClient,
  Db as MongoDB,
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
import type { PoolOptions as MySQLPoolOptions, Pool as MySQLPool } from "mysql2";
import type { RequestOptions as _OpenAIRequestOptions } from "openai/core";
import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";

export type { ClientOptions as OpenAIConfig } from "openai";

export type {
  MongoClientOptions,
  MongoClient,
  MongoDB,
  MongoFilter,
  MongoUpdateFilter,
  MongoUpdateOptions,
  MongoDeleteOptions,
  MongoFindOptions,
  MongoBulkWriteOptions,
  MongoOptionalUnlessRequiredId,
  MongoInsertOneOptions,
  MongoAggregateOptions,
  MySQLPoolOptions,
  MySQLPool
};

export type DefaultError = { status?: number; message: string };

export type ConnectionTypes = "kai" | "mysql";

export type KaiConnectionConfig = Omit<MongoClientOptions, "uri" | "database"> & {
  uri: string;
  database?: string;
};

export type MySQLConnectionConfig = MySQLPoolOptions;

export type ConnectionConfigsMap = {
  kai: KaiConnectionConfig;
  mysql: MySQLConnectionConfig;
};

type BaseConnection<T extends string, K extends object> = Omit<K, "type" | "dbName"> & {
  type: T;
  dbName?: string;
};

export type KaiConnection = BaseConnection<
  "kai",
  {
    client: MongoClient;
    db: (dbName?: string) => MongoDB;
  }
>;

export type MySQLConnection = BaseConnection<
  "mysql",
  Omit<ReturnType<MySQLPool["promise"]>, "tablePath"> & {
    tablePath: (table: string, dbName?: string) => string;
  }
>;

export type Connection<T extends ConnectionTypes = any> = T extends ConnectionTypes
  ? T extends "kai"
    ? KaiConnection
    : MySQLConnection
  : KaiConnection | MySQLConnection;

export type Request = (...args: any[]) => Promise<any>;

export type AggregateQuery = Record<any, any>[];

export type Filter = { [K: string]: any };

export type Embedding = number[];
export type EmbeddingInput = string | object | string[] | object[];

export type MySQLWhere = string;
export type MySQLSet = string;

type WithDb<T extends object> = Omit<T, "db" | "collection"> & {
  db?: string;
  collection: string;
};

type WithConnections<T extends object, K extends object = object, M extends object = object> = {
  kai: WithDb<T & K>;
  mysql: WithDb<T & M>;
};

export type InsertOneResult<T = any> = T;
export type InsertOneBody<T extends InsertOneResult = InsertOneResult> = WithConnections<
  { generateId?: boolean },
  {
    value: MongoOptionalUnlessRequiredId<T>;
    options?: MongoInsertOneOptions;
  },
  { value: T }
>;

export type InsertManyResult<T extends any[] = any[]> = T;
export type InsertManyBody<T extends InsertManyResult = InsertManyResult> = WithConnections<
  { generateId?: boolean },
  {
    values: MongoOptionalUnlessRequiredId<T[number]>[];
    options?: MongoBulkWriteOptions;
  },
  { values: T }
>;

export type UpdateManyResult<T extends any[] = any[]> = T;
export type UpdateManyBody<T extends UpdateManyResult = UpdateManyResult> = WithConnections<
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
export type DeleteManyBody<T extends any = any> = WithConnections<
  {},
  { filter: MongoFilter<T>; options?: MongoDeleteOptions },
  { where: MySQLWhere }
>;

export type FindOneResult<T = any> = T;
export type FindOneBody<T extends FindOneResult = FindOneResult> = WithConnections<
  {},
  { filter?: MongoFilter<T>; options?: MongoFindOptions },
  { columns?: string[]; where?: MySQLWhere }
>;

export type FindManyResult<T extends any[] = any[]> = T;
export type FindManyBody<T extends FindManyResult = FindManyResult> = WithConnections<
  {},
  { filter?: MongoFilter<T[number]>; options?: MongoFindOptions },
  { columns?: string[]; where?: MySQLWhere; skip?: number; limit?: number }
>;

export type QueryResult = any[];
export type QueryBody = {
  kai: WithDb<{
    query: object[];
    options?: MongoAggregateOptions;
  }>;
  mysql: { query: string };
};

export type CreateEmbeddingResult = Embedding[];
export type CreateEmbeddingBody = { input: EmbeddingInput };

export type VectorSearchResult = any[];
export type VectorSearchBody = WithDb<{
  query: string;
  embeddingField: string;
  limit?: number;
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
