import { createEleganceServerClient } from "./index";
import { ConnectionTypes } from "../shared/types";
import { createControllers } from "./controllers";

export type Routes = keyof ReturnType<typeof createControllers>;
export type EleganceServerClient<T extends ConnectionTypes> = ReturnType<typeof createEleganceServerClient<T>>;
