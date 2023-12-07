import { CreateFileEmbeddingsBody, CreateFileEmbeddingsResult } from "../../shared/types";
import { CreateFileEmbeddingsRequestBody, RequestInit } from "../types";
import { Fetcher } from "../utils";
import { toDataURL } from "../utils/helpers";

export function createFileEmbeddingsRequest(fetcher: Fetcher) {
  return <R extends CreateFileEmbeddingsResult = CreateFileEmbeddingsResult>(
    body: CreateFileEmbeddingsRequestBody,
    init?: RequestInit
  ) => {
    const { dataURL, file, ..._body } = body;

    const _fetch = async (body: CreateFileEmbeddingsBody) => {
      return fetcher<R>("/createFileEmbeddings", { ...init, method: "POST", body: JSON.stringify(body) });
    };

    return new Promise<R>((resolve, reject) => {
      toDataURL(dataURL || file || "", dataURL => {
        _fetch({ ..._body, dataURL })
          .then(resolve)
          .catch(reject);
      });
    });
  };
}
