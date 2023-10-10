import type { Controller } from "../../shared/types";

export function createController<T extends Controller>(controller: T) {
  return controller;
}
