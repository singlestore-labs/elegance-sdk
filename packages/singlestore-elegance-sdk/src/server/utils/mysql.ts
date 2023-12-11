import { createPool } from "mysql2";
import type { MySQLConnectionConfig, MySQLConnection } from "../../shared/types";

export function createMySQLConnection(config: MySQLConnectionConfig): MySQLConnection {
  const { database, ..._config } = config;

  if (!_config.host) {
    throw new Error("Host is undefined");
  }

  if (!_config.user) {
    throw new Error("User is undefined");
  }

  if (!_config.password) {
    throw new Error("Password is undefined");
  }

  const tablePath: MySQLConnection["tablePath"] = (table, dbName) => {
    const _dbName = dbName || database || "";
    return typeof _dbName === "string" && _dbName.length ? `${_dbName}.${table}` : table;
  };

  const pool = createPool(_config).promise();

  return Object.assign(pool, {
    type: "mysql",
    dbName: database,
    tablePath
  } satisfies Pick<MySQLConnection, "type" | "dbName" | "tablePath">);
}

export function toInsertValuesQuery(tablePath: string, value: object | object[]) {
  const values = Array.isArray(value) ? value : [value];
  const keys = Object.keys(values[0]);
  const query = `INSERT INTO ${tablePath} (${keys.join(", ")}) VALUES ?`;
  const valuesToInsert = values.map(Object.values);

  return { query, valuesToInsert };
}
