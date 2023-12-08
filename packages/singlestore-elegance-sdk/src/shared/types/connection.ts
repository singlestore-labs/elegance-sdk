import type { MongoClientOptions, MongoClient, Db as MongoDB } from "mongodb";
import type { PoolOptions as MySQLPoolOptions, Pool as MySQLPool } from "mysql2";

export type { MongoClientOptions, MongoClient, MongoDB, MySQLPoolOptions, MySQLPool };

export type ConnectionTypes = "kai" | "mysql";

type BaseConnection<T extends string, K extends object> = Omit<K, "type" | "dbName"> & { type: T; dbName?: string };

export type KaiConnectionConfig = Omit<MongoClientOptions, "uri" | "database"> & {
  uri: string;
  database?: string;
};

export type KaiConnection = BaseConnection<
  "kai",
  {
    client: MongoClient;
    db: (dbName?: string) => MongoDB;
  }
>;

export type MySQLConnectionConfig = MySQLPoolOptions;

export type MySQLConnection = BaseConnection<
  "mysql",
  Omit<ReturnType<MySQLPool["promise"]>, "tablePath"> & {
    tablePath: (table: string, dbName?: string) => string;
  }
>;

export type ConnectionConfigsMap = {
  kai: KaiConnectionConfig;
  mysql: MySQLConnectionConfig;
};

export type Connection<T extends ConnectionTypes = any> = T extends ConnectionTypes
  ? T extends "kai"
    ? KaiConnection
    : MySQLConnection
  : KaiConnection | MySQLConnection;
