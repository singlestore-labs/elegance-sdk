import type { ClientOptions as OpenAIConfig } from "openai";
import type { RequestOptions as _OpenAIRequestOptions } from "openai/core";
import type {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam
} from "openai/resources/chat/completions";

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

export type ChatCompletionMessage = {
  role: (string & {}) | ChatCompletionMessageParam["role"];
  content: ChatCompletionMessageParam["content"];
  name?: ChatCompletionMessageParam["name"];
  function_call?: ChatCompletionMessageParam["function_call"];
};

export type CreateChatCompletionParams = {
  model?: ChatCompletionCreateParamsNonStreaming["model"];
  prompt?: string;
  systemRole?: string;
  messages?: ChatCompletionMessage[];
  temperature?: number;
  maxTokens?: number;
};

export type CreateChatCompletionArgs = [params: CreateChatCompletionParams];
export type CreateChatCompletionResult = ChatCompletion | null;
export type CreateChatCompletion = (...args: CreateChatCompletionArgs) => Promise<CreateChatCompletionResult>;
