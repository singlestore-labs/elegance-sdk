import { createEleganceClient } from "@singlestore/elegance-sdk";

export const eleganceClientKai = createEleganceClient("kai", { baseURL: "http://localhost:3001/api/kai" });
export const eleganceClientMySQL = createEleganceClient("mysql", { baseURL: "http://localhost:3001/api/mysql" });
