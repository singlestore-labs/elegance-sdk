import type {
  ConnectionTypes,
  FindManyBody,
  FindManyResult,
  FindOneBody,
  FindOneResult,
  QueryBody,
  QueryResult,
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
  RequestInit
} from "../../shared/types";
import type { Fetcher } from "../utils/fetcher";
import { createAndInsertFileEmbeddingsRequest } from "./createAndInsertFileEmbeddings";
import { createFileEmbeddingsRequest } from "./createFileEmbeddings";

export function createRequests<T extends ConnectionTypes>(fetcher: Fetcher) {
  const _fetch = <R = any>(route: string, body: object, init?: RequestInit) => {
    return fetcher<R>(route, { ...init, method: "POST", body: JSON.stringify(body) });
  };

  return {
    insertOne: <R extends InsertOneResult = InsertOneResult>(body: InsertOneBody<R>[T], init?: RequestInit) => {
      return _fetch<R>("/insertOne", body, init);
    },

    insertMany: <R extends InsertManyResult = InsertManyResult>(body: InsertManyBody<R>[T], init?: RequestInit) => {
      return _fetch<R>("/insertMany", body, init);
    },

    updateMany: <R extends UpdateManyResult = UpdateManyResult>(body: UpdateManyBody<R>[T], init?: RequestInit) => {
      return _fetch<R>("/updateMany", body, init);
    },

    deleteMany: <K extends any = any>(body: DeleteManyBody<K>[T], init?: RequestInit) => {
      return _fetch<DeleteManyResult>("/deleteMany", body, init);
    },

    findOne: <R extends FindOneResult = FindOneResult>(body: FindOneBody<R>[T], init?: RequestInit) => {
      return _fetch<R>("/findOne", body, init);
    },

    findMany: <R extends FindManyResult = FindManyResult>(body: FindManyBody<R>[T], init?: RequestInit) => {
      return _fetch<R>("/findMany", body, init);
    },

    query: <R extends QueryResult = QueryResult>(body: QueryBody[T], init?: RequestInit) => {
      return _fetch<R>("/query", body, init);
    },

    createEmbedding: <R extends CreateEmbeddingResult = CreateEmbeddingResult>(
      body: CreateEmbeddingBody,
      init?: RequestInit
    ) => {
      return _fetch<R>("/createEmbedding", body, init);
    },

    createFileEmbeddings: createFileEmbeddingsRequest(fetcher),

    createAndInsertFileEmbeddings: createAndInsertFileEmbeddingsRequest(fetcher),

    vectorSearch: <R extends VectorSearchResult = VectorSearchResult>(body: VectorSearchBody, init?: RequestInit) => {
      return _fetch<R>("/vectorSearch", body, init);
    },

    chatCompletion: <R extends ChatCompletionResult = ChatCompletionResult>(
      body: ChatCompletionBody,
      init?: RequestInit
    ) => {
      return _fetch<R>("/chatCompletion", body, init);
    }
  };
}
