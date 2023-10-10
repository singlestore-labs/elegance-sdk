import { MongoClient } from "mongodb";
import type { KaiConnection, KaiConnectionConfig } from "../../shared/types";

export function createKaiConnection(config: KaiConnectionConfig): KaiConnection {
  if (!config.uri) {
    throw new Error("Kai URI is undefined");
  }

  if (!config.database) {
    throw new Error("Database name is undefined");
  }

  const { uri, database, ...options } = config;

  const client = new MongoClient(uri, options);
  const db = client.db(database);

  return { type: "kai", client, db };
}
