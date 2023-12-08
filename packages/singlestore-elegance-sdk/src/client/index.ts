import type { ConnectionTypes } from "../shared/types";
import { createFetcher } from "./utils/fetcher";
import { createHooks } from "./hooks";
import { createRequests } from "./requests";

export type ClientConfig = { baseURL: string; defaultRequestOptions?: Partial<RequestInit> };

export type EleganceClient<T extends ConnectionTypes> = ReturnType<typeof createEleganceClient<T>>;

export function createEleganceClient<T extends ConnectionTypes>(connectionType: T, config: ClientConfig) {
  const fetcher = createFetcher(config);
  const requests = createRequests<T>(fetcher);
  const hooks = createHooks<T>(requests);

  return { requests, hooks };
}
