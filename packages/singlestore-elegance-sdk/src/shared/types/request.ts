import { CreateAndInsertFileEmbeddingsBody, CreateFileEmbeddingsBody } from "./controllers";

export type Request = (...args: any[]) => Promise<any>;

export type RequestInit = Omit<Exclude<Parameters<typeof fetch>[1], undefined>, "body" | "method"> & {
  [K: string]: any;
};

export type CreateAndInsertFileEmbeddingsRequestBody = Omit<CreateAndInsertFileEmbeddingsBody, "dataURL"> &
  ({ dataURL: string; file?: never } | { file: File; dataURL?: never });

export type CreateFileEmbeddingsRequestBody = Omit<CreateFileEmbeddingsBody, "dataURL"> &
  ({ dataURL: string; file?: never } | { file: File; dataURL?: never });
