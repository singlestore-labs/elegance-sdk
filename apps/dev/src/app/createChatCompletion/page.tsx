"use client";

import { useState } from "react";

import { eleganceClientKai } from "@/services/eleganceClient";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { PageContent } from "@/components/PageContent";
import { State } from "@/components/State";
import { Textarea } from "@/components/Textarea";
import { CreateChatCompletionBody } from "@singlestore/elegance-sdk/types/dist";

export default function ChatCompletion() {
  const chatCompletionKai = eleganceClientKai.hooks.useCreateChatCompletion();
  const [prompt, setPrompt] = useState("");
  const [model, setModel] = useState<CreateChatCompletionBody["model"]>("gpt-3.5-turbo");
  const [systemRole, setSystemRole] = useState<CreateChatCompletionBody["systemRole"]>("");
  // const [messages, setMessages] = useState<CreateChatCompletionBody["messages"]>([]);
  const [maxTokens, setMaxTokens] = useState<number | undefined>();
  const [temperature, setTemperature] = useState<number | undefined>();

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    if (!prompt) return;

    await chatCompletionKai.execute({
      prompt,
      model,
      systemRole,
      // messages,
      maxTokens,
      temperature
    });
  };

  let responseText = "Ask somesting";
  if (chatCompletionKai.isLoading) responseText = "Loading...";
  if (!chatCompletionKai.isLoading && chatCompletionKai.value) responseText = chatCompletionKai.value ?? "";

  return (
    <PageContent heading="Feature: CreateChatCompletion">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <Input label="System role" value={systemRole} onChange={setSystemRole} />

        <div className="flex w-full gap-4">
          <Input label="Model" value={model} onChange={setModel} />
          <Input label="Max tokens" type="number" min={1} value={maxTokens} onChange={value => setMaxTokens(+value)} />
          <Input
            label="Temperature"
            type="number"
            min={0.0}
            step={0.1}
            value={temperature}
            onChange={value => setTemperature(+value)}
          />
        </div>

        <Textarea label="Prompt" value={prompt} onChange={setPrompt} />

        <Button type="submit" className="ml-auto" disabled={chatCompletionKai.isLoading}>
          Submit
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl">Response</h2>
        <p className="mt-8 max-h-[512px] w-full overflow-x-auto overflow-y-auto rounded border p-4">{responseText}</p>
      </div>

      <State kaiState={chatCompletionKai} />
    </PageContent>
  );
}
