import type {
  ConnectionTypes,
  FindManyBody,
  FindManyResult,
  FindOneBody,
  FindOneResult,
  QueryBody,
  QueryResult,
  CreateAndInsertFileEmbeddingsBody,
  CreateAndInsertFileEmbeddingsResult,
  VectorSearchBody,
  VectorSearchResult,
  ChatCompletionBody,
  ChatCompletionResult,
  InsertOneBody,
  InsertOneResult,
  InsertManyBody,
  InsertManyResult,
  UpdateManyBody,
  UpdateManyResult,
  DeleteManyBody,
  DeleteManyResult,
  CreateEmbeddingResult,
  CreateEmbeddingBody,
  CreateFileEmbeddingsResult,
  CreateFileEmbeddingsBody
} from "../shared/types";
import type { RequestOptions } from "./types";
import type { Fetcher } from "./utils";

export function createRequests<T extends ConnectionTypes>(fetcher: Fetcher) {
  const _fetch = <R = any>(route: string, body: object, init?: RequestOptions) => {
    return fetcher<R>(route, { ...init, method: "POST", body: JSON.stringify(body) });
  };

  type Init = Parameters<typeof _fetch>[2];

  return {
    insertOne: <R extends InsertOneResult = InsertOneResult>(body: InsertOneBody<R>[T], init?: Init) => {
      return _fetch<R>("/insertOne", body, init);
    },

    insertMany: <R extends InsertManyResult = InsertManyResult>(body: InsertManyBody<R>[T], init?: Init) => {
      return _fetch<R>("/insertMany", body, init);
    },

    updateMany: <R extends UpdateManyResult = UpdateManyResult>(body: UpdateManyBody<R>[T], init?: Init) => {
      return _fetch<R>("/updateMany", body, init);
    },

    deleteMany: <K extends any = any>(body: DeleteManyBody<K>[T], init?: Init) => {
      return _fetch<DeleteManyResult>("/deleteMany", body, init);
    },

    findOne: <R extends FindOneResult = FindOneResult>(body: FindOneBody<R>[T], init?: Init) => {
      return _fetch<R>("/findOne", body, init);
    },

    findMany: <R extends FindManyResult = FindManyResult>(body: FindManyBody<R>[T], init?: Init) => {
      return _fetch<R>("/findMany", body, init);
    },

    query: <R extends QueryResult = QueryResult>(body: QueryBody[T], init?: Init) => {
      return _fetch<R>("/query", body, init);
    },

    createEmbedding: <R extends CreateEmbeddingResult = CreateEmbeddingResult>(
      body: CreateEmbeddingBody,
      init?: Init
    ) => {
      return _fetch<R>("/createEmbedding", body, init);
    },

    createFileEmbeddings: <R extends CreateFileEmbeddingsResult = CreateFileEmbeddingsResult>(
      body: CreateFileEmbeddingsBody,
      init?: Init
    ) => {
      return _fetch<R>("/createFileEmbeddings", body, init);
    },

    createAndInsertFileEmbeddings: <
      R extends CreateAndInsertFileEmbeddingsResult = CreateAndInsertFileEmbeddingsResult
    >(
      body: CreateAndInsertFileEmbeddingsBody[T],
      init?: Init
    ) => {
      return _fetch<R>("/createAndInsertFileEmbeddings", body, init);
    },

    vectorSearch: <R extends VectorSearchResult = VectorSearchResult>(body: VectorSearchBody[T], init?: Init) => {
      return _fetch<R>("/vectorSearch", body, init);
    },

    chatCompletion: <R extends ChatCompletionResult = ChatCompletionResult>(
      body: ChatCompletionBody[T],
      init?: Init
    ) => {
      return _fetch<R>("/chatCompletion", body, init);
    }
  };
}
