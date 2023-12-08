import type { ClientOptions as OpenAIConfig } from "openai";
import type { RequestOptions as _OpenAIRequestOptions } from "openai/core";
import type {
  ChatCompletionCreateParamsBase,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam
} from "openai/resources/chat/completions";

export type { ChatCompletionCreateParamsNonStreaming };

export type AICustomizers = {
  createEmbedding?: CreateEmbedding;
  createChatCompletion?: CreateChatCompletion;
};

export type AIConfig = {
  openai?: OpenAIConfig;
  customizers?: AICustomizers;
};

// Embedding
export type Embedding = number[];
export type EmbeddingInput = string | object | string[] | object[];
export type CreateEmbeddingArgs = [input: EmbeddingInput];
export type CreateEmbeddingResult = Embedding[];
export type CreateEmbedding = (...args: CreateEmbeddingArgs) => Promise<CreateEmbeddingResult>;

// ChatCompletion
export type ChatCompletion = string;

export type ChatCompletionMessage = Pick<ChatCompletionMessageParam, "content" | "name" | "function_call"> & {
  role: (string & {}) | ChatCompletionMessageParam["role"];
};

export type CreateChatCompletionParams = Pick<ChatCompletionCreateParamsBase, "temperature"> & {
  model?: ChatCompletionCreateParamsBase["model"];
  prompt?: string;
  systemRole?: string;
  messages?: ChatCompletionMessage[];
  maxTokens?: ChatCompletionCreateParamsBase["max_tokens"];
};

export type CreateChatCompletionArgs = [params: CreateChatCompletionParams];
export type CreateChatCompletionResult = ChatCompletion | null;
export type CreateChatCompletion = (...args: CreateChatCompletionArgs) => Promise<CreateChatCompletionResult>;
