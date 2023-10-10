import { createPool } from "mysql2";
import type { MySQLConnectionConfig, MySQLConnection } from "../../shared/types";

export function createMySQLConnection(config: MySQLConnectionConfig): MySQLConnection {
  if (!config.host) {
    throw new Error("Host is undefined");
  }

  if (!config.user) {
    throw new Error("User is undefined");
  }

  if (!config.password) {
    throw new Error("Password is undefined");
  }

  if (!config.database) {
    throw new Error("Database name is undefined");
  }

  return Object.assign(createPool(config), { type: "mysql" as MySQLConnection["type"] });
}

export function toInsertValuesQuery(table: string, value: object | object[]) {
  const values = Array.isArray(value) ? value : [value];
  const keys = Object.keys(values[0]);
  const query = `INSERT INTO ${table} (${keys.join(", ")}) VALUES ?`;
  const valuesToInsert = values.map(Object.values);

  return { query, valuesToInsert };
}
