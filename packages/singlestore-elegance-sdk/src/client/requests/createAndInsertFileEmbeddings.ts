import type {
  CreateAndInsertFileEmbeddingsBody,
  CreateAndInsertFileEmbeddingsResult,
  CreateAndInsertFileEmbeddingsRequestBody,
  RequestInit
} from "../../shared/types";
import { Fetcher } from "../utils/fetcher";
import { toDataURL } from "../utils/helpers";

export function createAndInsertFileEmbeddingsRequest(fetcher: Fetcher) {
  return <R extends CreateAndInsertFileEmbeddingsResult = CreateAndInsertFileEmbeddingsResult>(
    body: CreateAndInsertFileEmbeddingsRequestBody,
    init?: RequestInit
  ) => {
    const { dataURL, file, ..._body } = body;

    const _fetch = (body: CreateAndInsertFileEmbeddingsBody) => {
      return fetcher<R>("/createAndInsertFileEmbeddings", { ...init, method: "POST", body: JSON.stringify(body) });
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
