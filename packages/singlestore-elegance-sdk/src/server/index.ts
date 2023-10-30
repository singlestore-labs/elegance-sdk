import type { ConnectionTypes } from "../shared/types";
import type { EleganceServerClientConfig } from "./types";
import { createControllers } from "./controllers";
import { createConnection, createOpenAI } from "./utils";

export { ObjectId } from "mongodb";
export * from "./types";

export function createRouteHandler<T extends Record<string, any>>(controllers: T) {
  return <K extends keyof T>(route: K, ...args: Parameters<T[K]["execute"]>): ReturnType<T[K]["execute"]> => {
    return controllers[route].execute(...args);
  };
}

export function createEleganceServerClient<
  T extends ConnectionTypes,
  C extends EleganceServerClientConfig<T> = EleganceServerClientConfig<T>
>(type: T, config: C) {
  const connection = createConnection(type, config.connection);
  const openai = createOpenAI(config.openai);
  const controllers = createControllers(connection, openai);
  const handleRoute = createRouteHandler(controllers);

  return { connection, controllers, handleRoute, openai };
}
