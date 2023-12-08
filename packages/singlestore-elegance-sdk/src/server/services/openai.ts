import OpenAI from "openai";

import type { AIConfig } from "../../shared/types";

export function createOpenAI(config: AIConfig["openai"]) {
  if (!config?.apiKey) throw new Error("OpenAI API key is undefined");
  return new OpenAI(config);
}
