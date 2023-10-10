import { createEleganceServerClient } from "@singlestore/elegance-sdk/server";
import { DB_NAME } from "@/constants";

export const eleganceServerClientKai = createEleganceServerClient("kai", {
  connection: {
    uri: process.env.KAI_URI ?? "",
    database: DB_NAME
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  }
});

export const eleganceServerClientMySQL = createEleganceServerClient("mysql", {
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.DB_PASSWORD,
    database: DB_NAME
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  }
});
