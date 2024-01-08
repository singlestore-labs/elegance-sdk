import { inspect as utilInspect } from "util";
import type { DefaultError } from "../shared/types";

export function inspect(data: any) {
  console.log(utilInspect(data, { showHidden: false, depth: null, colors: true }));
}

export function isDefaultError(value: any): value is DefaultError {
  return "message" in value;
}

export function handleError(error: any, status = 500): DefaultError {
  let message = "";

  if ("message" in error && error.message) {
    message = error.message;
  }

  if ("sqlMessage" in error && error.sqlMessage) {
    message = error.sqlMessage;
  }

  if (!message && error.code) {
    message = error.code;
  }

  if (!message) {
    message = "Undefined error";
  }

  return { status, message };
}
