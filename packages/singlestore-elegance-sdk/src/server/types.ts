import { createEleganceServerClient } from "./index";
import type { ConnectionConfigsMap, ConnectionTypes, OpenAIConfig } from "../shared/types";
import { createControllers } from "./controllers";

export type Routes = keyof ReturnType<typeof createControllers>;
export type EleganceServerClient<T extends ConnectionTypes> = ReturnType<typeof createEleganceServerClient<T>>;

export type EleganceServerClientConfig<T extends ConnectionTypes> = {
  connection: ConnectionConfigsMap[T];
  openai?: OpenAIConfig;
};
