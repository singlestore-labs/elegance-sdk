import type { ConnectionTypes } from "../shared/types";
import type { EleganceServerClientConfig } from "./types";
import { createControllers } from "./controllers";
import { createAI, createConnection } from "./utils";

export { ObjectId } from "mongodb";
export * from "./types";

export function createEleganceServerClient<
  T extends ConnectionTypes,
  C extends EleganceServerClientConfig<T> = EleganceServerClientConfig<T>
>(type: T, config: C) {
  const connection = createConnection(type, config.connection);
  const ai = createAI(config.ai);
  const controllers = createControllers(connection, ai);
  const handleRoute = createRouteHandler(controllers);

  return { connection, ai, controllers, handleRoute };
}

function createRouteHandler<T extends Record<string, any>>(controllers: T) {
  return <K extends keyof T>(route: K, ...args: Parameters<T[K]>): ReturnType<T[K]> => {
    return controllers[route](...args);
  };
}
