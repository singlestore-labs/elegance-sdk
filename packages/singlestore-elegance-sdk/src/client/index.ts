import type { ConnectionTypes } from "../shared/types";
import type { ClientConfig } from "./types";
import { createFetcher } from "./utils";
import { createHooks } from "./hooks";
import { createRequests } from "./requests";

export * from "./types";

export function createEleganceClient<T extends ConnectionTypes>(connectionType: T, config: ClientConfig) {
  const fetcher = createFetcher(config);
  const requests = createRequests<T>(fetcher);
  const hooks = createHooks<T>(requests);

  return { requests, hooks };
}
