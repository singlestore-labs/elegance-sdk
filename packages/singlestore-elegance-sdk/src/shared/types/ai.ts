import type { ClientOptions as OpenAIConfig } from "openai";
import type { RequestOptions as _OpenAIRequestOptions } from "openai/core";
import type { ChatCompletionCreateParamsNonStreaming } from "openai/resources/chat/completions";

export type { ChatCompletionCreateParamsNonStreaming };

export type Embedding = number[];
export type EmbeddingInput = string | object | string[] | object[];

export type AICustomizers = {
  createEmbedding?: CreateEmbedding;
  createChatCompletion?: (body: any) => Promise<string | null>;
};

export type AIConfig = {
  openai?: OpenAIConfig;
  customizers?: AICustomizers;
};

export type CreateEmbedding = (input: EmbeddingInput) => Promise<Embedding[]>;
