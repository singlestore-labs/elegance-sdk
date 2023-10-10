import type { Connection, ConnectionTypes, ConnectionConfigsMap } from "../../shared/types";
import { createKaiConnection } from "./kai";
import { createMySQLConnection } from "./mysql";

export function createConnection<T extends ConnectionTypes>(type: T, config: ConnectionConfigsMap[T]) {
  return (isKaiConfig(type, config) ? createKaiConnection(config) : createMySQLConnection(config)) as Connection<T>;
}

function isKaiConfig(type: string, _config: object): _config is ConnectionConfigsMap["kai"] {
  return type === "kai";
}
