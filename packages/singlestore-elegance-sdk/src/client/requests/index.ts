import type {
  ConnectionTypes,
  FindManyBody,
  FindManyResult,
  FindOneBody,
  FindOneResult,
  QueryBody,
  QueryResult,
  DotProductSearchBody,
  DotProductSearchResult,
  SearchChatCompletionBody,
  SearchChatCompletionResult,
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
  RequestInit,
  CreateChatCompletionResult,
  CreateChatCompletionBody,
} from "../../shared/types";
import type { Fetcher } from "../utils/fetcher";
import { createAndInsertFileEmbeddingsRequest } from "./createAndInsertFileEmbeddings";
import { createFileEmbeddingsRequest } from "./createFileEmbeddings";

export function createRequests<T extends ConnectionTypes>(fetcher: Fetcher) {
  const _fetch = <R = any>(route: string, body: object, init?: RequestInit) => {
    return fetcher<R>(route, {
      ...init,
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  return {
    insertOne: <R extends InsertOneResult = InsertOneResult>(
      body: InsertOneBody<R>[T],
      init?: RequestInit
    ) => {
      return _fetch<R>("/insertOne", body, init);
    },

    insertMany: <R extends InsertManyResult = InsertManyResult>(
      body: InsertManyBody<R>[T],
      init?: RequestInit
    ) => {
      return _fetch<R>("/insertMany", body, init);
    },

    updateMany: <R extends UpdateManyResult = UpdateManyResult>(
      body: UpdateManyBody<R>[T],
      init?: RequestInit
    ) => {
      return _fetch<R>("/updateMany", body, init);
    },

    deleteMany: <K extends any = any>(
      body: DeleteManyBody<K>[T],
      init?: RequestInit
    ) => {
      return _fetch<DeleteManyResult>("/deleteMany", body, init);
    },

    findOne: <R extends FindOneResult = FindOneResult>(
      body: FindOneBody<R>[T],
      init?: RequestInit
    ) => {
      return _fetch<R>("/findOne", body, init);
    },

    findMany: <R extends FindManyResult = FindManyResult>(
      body: FindManyBody<R>[T],
      init?: RequestInit
    ) => {
      return _fetch<R>("/findMany", body, init);
    },

    query: <R extends QueryResult = QueryResult>(
      body: QueryBody[T],
      init?: RequestInit
    ) => {
      return _fetch<R>("/query", body, init);
    },

    createEmbedding: <R extends CreateEmbeddingResult = CreateEmbeddingResult>(
      body: CreateEmbeddingBody,
      init?: RequestInit
    ) => {
      return _fetch<R>("/createEmbedding", body, init);
    },

    createFileEmbeddings: createFileEmbeddingsRequest(fetcher),

    createAndInsertFileEmbeddings:
      createAndInsertFileEmbeddingsRequest(fetcher),

    createChatCompletion: <
      R extends CreateChatCompletionResult = CreateChatCompletionResult
    >(
      body: CreateChatCompletionBody,
      init?: RequestInit
    ) => {
      return _fetch<R>("/createChatCompletion", body, init);
    },

    searchChatCompletion: <
      R extends SearchChatCompletionResult = SearchChatCompletionResult
    >(
      body: SearchChatCompletionBody,
      init?: RequestInit
    ) => {
      return _fetch<R>("/searchChatCompletion", body, init);
    },

    dotProductSearch: <
      R extends DotProductSearchResult = DotProductSearchResult
    >(
      body: DotProductSearchBody,
      init?: RequestInit
    ) => {
      return _fetch<R>("/dotProductSearch", body, init);
    },
  };
}
