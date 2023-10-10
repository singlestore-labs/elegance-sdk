import type { ConnectionTypes } from "../shared/types";
import { createEleganceClient } from "./index";

export type RequestOptions = Omit<Exclude<Parameters<typeof fetch>[1], undefined>, "body" | "method"> & {
  [K: string]: any;
};

export type ClientConfig = { baseURL: string; defaultRequestOptions?: Partial<RequestOptions> };

export type EleganceClient<T extends ConnectionTypes> = ReturnType<typeof createEleganceClient<T>>;
