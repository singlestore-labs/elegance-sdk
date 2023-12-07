import { AIConfig, createEleganceServerClient } from "@singlestore/elegance-sdk/server";
import { DB_NAME_KAI, DB_NAME_MYSQL } from "@/constants";

const ai: AIConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY
  }
};

export const eleganceServerClientKai = createEleganceServerClient("kai", {
  connection: {
    uri: process.env.KAI_URI ?? "",
    database: DB_NAME_KAI
  },
  ai
});

export const eleganceServerClientMySQL = createEleganceServerClient("mysql", {
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.DB_PASSWORD,
    database: DB_NAME_MYSQL
  },
  ai
});
