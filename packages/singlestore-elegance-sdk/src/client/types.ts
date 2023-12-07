import type { ConnectionTypes, CreateFileEmbeddingsBody, CreateAndInsertFileEmbeddingsBody } from "../shared/types";
import { createEleganceClient } from "./index";

export type RequestInit = Omit<Exclude<Parameters<typeof fetch>[1], undefined>, "body" | "method"> & {
  [K: string]: any;
};

export type ClientConfig = { baseURL: string; defaultRequestOptions?: Partial<RequestInit> };

export type EleganceClient<T extends ConnectionTypes> = ReturnType<typeof createEleganceClient<T>>;

export type CreateAndInsertFileEmbeddingsRequestBody = Omit<CreateAndInsertFileEmbeddingsBody, "dataURL"> &
  ({ dataURL: string; file?: never } | { file: File; dataURL?: never });

export type CreateFileEmbeddingsRequestBody = Omit<CreateFileEmbeddingsBody, "dataURL"> &
  ({ dataURL: string; file?: never } | { file: File; dataURL?: never });
