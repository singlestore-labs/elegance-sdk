import type { ConnectionTypes, ConnectionConfigsMap, OpenAIConfig } from "../shared/types";
import { createControllers } from "./controllers";
import { createConnection, createOpenAI } from "./utils";

export { ObjectId } from "mongodb";
export * from "./types";

export function createRouteHandler<T extends Record<string, any>>(controllers: T) {
  return <K extends keyof T>(route: K, ...args: Parameters<T[K]["execute"]>): ReturnType<T[K]["execute"]> => {
    return controllers[route].execute(...args);
  };
}

export function createEleganceServerClient<T extends ConnectionTypes>(
  type: T,
  config: {
    connection: ConnectionConfigsMap[T];
    openai?: OpenAIConfig;
  }
) {
  const connection = createConnection(type, config.connection);
  const openai = createOpenAI(config.openai);
  const controllers = createControllers(connection, openai);
  const handleRoute = createRouteHandler(controllers);

  return { connection, controllers, handleRoute, openai };
}
