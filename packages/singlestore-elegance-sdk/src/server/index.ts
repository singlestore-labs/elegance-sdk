import type { AIConfig, ConnectionConfigsMap, ConnectionTypes } from "../shared/types";
import { createControllers } from "./controllers";
import { createConnection } from "./utils/connection";
import { createAI } from "./ai";

export { ObjectId } from "mongodb";
export { OpenAI } from "openai";

export type ServerClientConfig<T extends ConnectionTypes> = {
  connection: ConnectionConfigsMap[T];
  ai?: AIConfig;
};

export type EleganceServerClient<T extends ConnectionTypes> = ReturnType<typeof createEleganceServerClient<T>>;

export type Routes = keyof ReturnType<typeof createControllers>;

export function createEleganceServerClient<
  T extends ConnectionTypes,
  C extends ServerClientConfig<T> = ServerClientConfig<T>
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
