"use client";

import { useState } from "react";
import { CollectionOrTableField } from "@/components/CollectionOrTableField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/Button";

export default function ChatCompletion() {
  const chatCompletionKai = eleganceClientKai.hooks.useChatCompletion();
  const chatCompletionMySQL = eleganceClientMySQL.hooks.useChatCompletion();
  const [connectionTypeValue, setConnectionTypeValue] = useState("kai");
  const [collectionValue, setCollectionValue] = useState("stars_data_embedding_csv");
  const [textFieldValue, setTextFieldValue] = useState("text");
  const [embeddingFieldValue, setEmbeddingFieldValue] = useState("embedding");
  const [maxTokensValue, setMaxTokensValue] = useState<number | undefined>();
  const [temperatureValue, setTemperatureValue] = useState<number | undefined>();
  const [minSimilarityValue, setMinSimilarityValue] = useState<number>(0.7);
  const [promptValue, setPromptValue] = useState("");
  const activeState = connectionTypeValue === "kai" ? chatCompletionKai : chatCompletionMySQL;

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    if (!promptValue) return;

    const payload = {
      textField: textFieldValue,
      embeddingField: embeddingFieldValue,
      maxTokens: maxTokensValue,
      temperature: temperatureValue,
      prompt: promptValue,
      minSimilarity: minSimilarityValue
    };

    if (connectionTypeValue === "kai") {
      await chatCompletionKai.execute({ ...payload, collection: collectionValue });
    } else {
      await chatCompletionMySQL.execute({ ...payload, table: collectionValue });
    }
  };

  let responseText = "Ask somesting";
  if (activeState.isLoading) responseText = "Loading...";
  if (!activeState.isLoading && activeState.value) responseText = activeState.value.content ?? "";

  return (
    <PageContent heading="Feature: ChatCompletion">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionTypeValue} onChange={setConnectionTypeValue} />

        <CollectionOrTableField
          connectionType={connectionTypeValue}
          value={collectionValue}
          onChange={setCollectionValue}
        />

        <div className="flex w-full gap-4">
          <label className="w-full ">
            <span className="mb-2 inline-block">Text field</span>
            <input
              name="textFieldValue"
              placeholder="Enter text field name"
              value={textFieldValue}
              onChange={event => setTextFieldValue(event.target.value)}
              className="w-full rounded border px-4 py-2 "
            />
          </label>

          <label className="w-full ">
            <span className="mb-2 inline-block">Embedding field</span>
            <input
              name="embeddingFieldValue"
              placeholder="Enter embedding field name"
              value={embeddingFieldValue}
              onChange={event => setEmbeddingFieldValue(event.target.value)}
              className="w-full rounded border px-4 py-2 "
            />
          </label>
        </div>

        <div className="flex w-full gap-4">
          <label className="w-full ">
            <span className="mb-2 inline-block">Max tokens</span>
            <input
              type="number"
              name="maxTokensValue"
              placeholder="Enter max tokens"
              min={1}
              value={maxTokensValue}
              onChange={event => setMaxTokensValue(+event.target.value)}
              className="w-full rounded border px-4 py-2 "
            />
          </label>
          <label className="w-full ">
            <span className="mb-2 inline-block">Temperature</span>
            <input
              type="number"
              name="temperatureValue"
              placeholder="Enter temperature"
              min={0.0}
              step={0.1}
              value={temperatureValue}
              onChange={event => setTemperatureValue(+event.target.value)}
              className="w-full rounded border px-4 py-2 "
            />
          </label>
        </div>

        <label className="w-full ">
          <span className="mb-2 inline-block">Min similarity</span>
          <input
            type="number"
            name="minSimilarityValue"
            placeholder="Enter min similarity value"
            min={0.0}
            step={0.0000000000000001}
            value={minSimilarityValue}
            onChange={event => setMinSimilarityValue(+event.target.value)}
            className="w-full rounded border px-4 py-2 "
          />
        </label>

        <label className="w-full ">
          <span className="mb-2 inline-block">Prompt</span>
          <textarea
            name="promptValue"
            placeholder="Enter prompt"
            rows={5}
            value={promptValue}
            onChange={event => setPromptValue(event.target.value)}
            className="w-full rounded border px-4 py-2 "
          />
        </label>

        <Button type="submit" className="ml-auto" disabled={activeState.isLoading}>
          Submit
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl">Response</h2>
        <p className="mt-8 max-h-[512px] w-full overflow-x-auto overflow-y-auto rounded border   p-4">{responseText}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl">Feature state</h2>
        <pre className="mt-8 max-h-[512px] w-full overflow-x-auto overflow-y-auto whitespace-pre-wrap rounded border   p-4">
          {JSON.stringify(activeState, null, 2)}
        </pre>
      </div>
    </PageContent>
  );
}
