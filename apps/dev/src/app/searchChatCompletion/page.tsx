"use client";

import { useState } from "react";
import { ConnectionTypes, SearchChatCompletionBody } from "@singlestore/elegance-sdk/types";

import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { Button } from "@/components/Button";
import { CollectionField } from "@/components/CollectionField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { DatabaseField } from "@/components/DatabaseField";
import { Input } from "@/components/Input";
import { PageContent } from "@/components/PageContent";
import { State } from "@/components/State";
import { Textarea } from "@/components/Textarea";

export default function SearchChatCompletion() {
  const chatCompletionKai = eleganceClientKai.hooks.useSearchChatCompletion();
  const chatCompletionMySQL = eleganceClientMySQL.hooks.useSearchChatCompletion();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("");
  const [prompt, setPrompt] = useState<SearchChatCompletionBody["prompt"]>("");
  const [textField, setTextField] = useState<SearchChatCompletionBody["textField"]>("text");
  const [embeddingField, setEmbeddingField] = useState<SearchChatCompletionBody["embeddingField"]>("embedding");
  const [minSimilarity, setMinSimilarity] = useState<SearchChatCompletionBody["minSimilarity"]>();
  const [maxContextLength, setMaxContextLength] = useState<SearchChatCompletionBody["maxContextLength"]>(500);
  const [model, setModel] = useState<SearchChatCompletionBody["model"]>("gpt-3.5-turbo");
  const [systemRole, setSystemRole] = useState<SearchChatCompletionBody["systemRole"]>("");
  const [maxTokens, setMaxTokens] = useState<SearchChatCompletionBody["maxTokens"]>();
  const [temperature, setTemperature] = useState<SearchChatCompletionBody["temperature"]>();
  const activeState = connectionType === "kai" ? chatCompletionKai : chatCompletionMySQL;

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    if (!prompt) return;

    const payload: SearchChatCompletionBody = {
      db,
      collection,
      prompt,
      model,
      systemRole,
      textField,
      embeddingField,
      maxTokens,
      temperature,
      minSimilarity,
      maxContextLength
    };

    if (connectionType === "kai") {
      await chatCompletionKai.execute(payload);
    } else {
      await chatCompletionMySQL.execute(payload);
    }
  };

  let responseText = "Ask somesting";
  if (activeState.isLoading) responseText = "Loading...";
  if (!activeState.isLoading && activeState.value) responseText = activeState.value.content ?? "";

  return (
    <PageContent heading="Feature: SearchChatCompletion">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionType} onChange={setConnectionType} />
        <DatabaseField value={db} onChange={setDb} />
        <CollectionField value={collection} onChange={setCollection} />

        <div className="flex w-full gap-4">
          <Input label="Text field" value={textField} onChange={setTextField} />
          <Input label="Embedding field" value={embeddingField} onChange={setEmbeddingField} />
        </div>

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

        <div className="flex w-full gap-4">
          <Input
            label="Min similarity"
            type="number"
            min={0.0}
            step={0.01}
            value={minSimilarity}
            onChange={value => setMinSimilarity(+value)}
          />

          <Input
            label="Max context length"
            type="number"
            min={0}
            value={maxContextLength}
            onChange={value => setMaxContextLength(+value)}
          />
        </div>

        <Input label="System role" value={systemRole} onChange={setSystemRole} />
        <Textarea label="Prompt" value={prompt} onChange={setPrompt} />

        <Button type="submit" className="ml-auto" disabled={activeState.isLoading}>
          Submit
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl">Response</h2>
        <p className="mt-8 max-h-[512px] w-full overflow-x-auto overflow-y-auto rounded border p-4">{responseText}</p>
      </div>

      <State connectionType={connectionType} mysqlState={chatCompletionMySQL} kaiState={chatCompletionKai} />
    </PageContent>
  );
}
