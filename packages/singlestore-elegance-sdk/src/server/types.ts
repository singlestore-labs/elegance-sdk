import { createEleganceServerClient } from "./index";
import type {
  ConnectionConfigsMap,
  ConnectionTypes,
  CreateChatCompletionBody,
  EmbeddingInput,
  OpenAIConfig
} from "../shared/types";
import { createControllers } from "./controllers";

export type Routes = keyof ReturnType<typeof createControllers>;
export type EleganceServerClient<T extends ConnectionTypes> = ReturnType<typeof createEleganceServerClient<T>>;

export type AICustomizers = {
  createEmbedding?: (input: EmbeddingInput) => Promise<number[][]>;
  createChatCompletion?: (body: CreateChatCompletionBody) => Promise<string | null>;
};

export type AIConfig = ({ openai?: never } | { openai?: OpenAIConfig }) & {
  customizers?: AICustomizers;
};

export type EleganceServerClientConfig<T extends ConnectionTypes> = {
  connection: ConnectionConfigsMap[T];
  ai?: AIConfig;
};
