import type {
  ConnectionTypes,
  FindManyResult,
  FindOneResult,
  QueryResult,
  CreateAndInsertFileEmbeddingsResult,
  DotProductSearchResult,
  SearchChatCompletionResult,
  InsertOneResult,
  InsertManyResult,
  UpdateManyResult,
  DeleteManyResult,
  CreateEmbeddingResult,
  CreateFileEmbeddingsResult,
  CreateChatCompletionResult,
} from "../../shared/types";
import { createRequests } from "../requests";
import { UseRequestOptions, useRequest } from "./useRequest";

export function createHooks<T extends ConnectionTypes>(
  requests: ReturnType<typeof createRequests<T>>
) {
  return {
    useInsertOne: <R extends InsertOneResult = InsertOneResult>(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.insertOne<R>, options);
    },

    useInsertMany: <R extends InsertManyResult = InsertManyResult>(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.insertMany<R>, options);
    },

    useUpdateMany: <R extends UpdateManyResult = UpdateManyResult>(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.updateMany<R>, options);
    },

    useDeleteMany: <K extends any = any>(
      options?: UseRequestOptions<DeleteManyResult>
    ) => {
      return useRequest(requests.deleteMany<K>, options);
    },

    useFindOne: <R extends FindOneResult = FindOneResult>(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.findOne<R>, options);
    },

    useFindMany: <R extends FindManyResult = FindManyResult>(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.findMany<R>, options);
    },

    useQuery: <R extends QueryResult = QueryResult>(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.query<R>, options);
    },

    useCreateEmbedding: <
      R extends CreateEmbeddingResult = CreateEmbeddingResult
    >(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.createEmbedding<R>, options);
    },

    useCreateFileEmbeddings: <
      R extends CreateFileEmbeddingsResult = CreateFileEmbeddingsResult
    >(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.createFileEmbeddings<R>, options);
    },

    useCreateAndInsertFileEmbeddings: <
      R extends CreateAndInsertFileEmbeddingsResult = CreateAndInsertFileEmbeddingsResult
    >(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.createAndInsertFileEmbeddings<R>, options);
    },

    useCreateChatCompletion: <
      R extends CreateChatCompletionResult = CreateChatCompletionResult
    >(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.createChatCompletion<R>, options);
    },

    useSearchChatCompletion: <
      R extends SearchChatCompletionResult = SearchChatCompletionResult
    >(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.searchChatCompletion<R>, options);
    },

    useDotProductSearch: <
      R extends DotProductSearchResult = DotProductSearchResult
    >(
      options?: UseRequestOptions<R>
    ) => {
      return useRequest(requests.dotProductSearch<R>, options);
    },
  };
}
