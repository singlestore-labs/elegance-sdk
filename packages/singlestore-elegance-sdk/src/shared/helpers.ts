import { inspect as utilInspect } from "util";
import type { DefaultError } from "../shared/types";

export function inspect(data: any) {
  console.log(utilInspect(data, { showHidden: false, depth: null, colors: true }));
}

export function isDefaultError(value: any): value is DefaultError {
  return "message" in value;
}

export function handleError(error: any, status = 500): DefaultError {
  let message = "Undefined error";

  if (error instanceof Error) {
    message = error.message;
  }

  if ("sqlMessage" in error) {
    message = error.sqlMessage ?? error.message;
  }

  return { status, message };
}
