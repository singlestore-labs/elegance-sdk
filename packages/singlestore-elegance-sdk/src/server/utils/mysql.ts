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

  return Object.assign(createPool(config), {
    type: "mysql" as MySQLConnection["type"],
    dbName: config.database as MySQLConnection["dbName"]
  });
}

export function processDbName(connection: MySQLConnection, dbName?: string): string {
  return dbName ?? connection.dbName ?? "";
}

export function concatDbAndTableNames(table: string, dbName?: string) {
  return typeof dbName === "string" && dbName.length ? `${dbName}.${table}` : table;
}

export function getTablePath(connection: MySQLConnection, table: string, dbName?: string) {
  const _dbName = processDbName(connection, dbName);
  return concatDbAndTableNames(table, _dbName);
}

export function toInsertValuesQuery(tablePath: string, value: object | object[]) {
  const values = Array.isArray(value) ? value : [value];
  const keys = Object.keys(values[0]);
  const query = `INSERT INTO ${tablePath} (${keys.join(", ")}) VALUES ?`;
  const valuesToInsert = values.map(Object.values);

  return { query, valuesToInsert };
}
