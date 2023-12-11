import { ChatCompletionMessageParam } from "openai/resources/chat";
import { AIConfig, CreateChatCompletion } from "../../shared/types";
import { createOpenAI } from "../services/openai";

export function createChatCompletion(config: AIConfig["openai"]) {
  return (async params => {
    const openai = createOpenAI(config);

    const { prompt, systemRole, messages, maxTokens, ...restOptions } = params;
    let _messages: ChatCompletionMessageParam[] = [];

    if (systemRole) {
      _messages.push({ role: "system", content: systemRole });
    }

    if (messages?.length) {
      _messages = [..._messages, ...(messages as ChatCompletionMessageParam[])];
    }

    if (prompt) {
      _messages = [..._messages, { role: "user", content: prompt }];
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      ...restOptions,
      messages: _messages,
      max_tokens: maxTokens,
      stream: false
    });

    return response.choices[0]?.message.content;
  }) satisfies CreateChatCompletion;
}
