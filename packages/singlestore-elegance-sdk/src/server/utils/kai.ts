import { MongoClient } from "mongodb";
import type { KaiConnection, KaiConnectionConfig } from "../../shared/types";

export function createKaiConnection(
  config: KaiConnectionConfig
): KaiConnection {
  const { uri, database, ...options } = config;

  const client = new MongoClient(uri, options);

  const db: KaiConnection["db"] = (dbName) => {
    return client.db(dbName || database || "");
  };

  return {
    type: "kai",
    dbName: database,
    client,
    db,
  };
}
