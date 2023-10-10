"use client";

import { useState } from "react";
import { eleganceClientKai } from "@/services/eleganceClient";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/Button";

export default function CreateEmbedding() {
  const createEmbeddingKai = eleganceClientKai.hooks.useCreateEmbedding();
  const [inputFieldValue, setInputFieldValue] = useState("");

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    await createEmbeddingKai.execute({ input: inputFieldValue });
  };

  return (
    <PageContent heading="Feature: CreateEmbedding">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <label className="w-full ">
          <span className="mb-2 inline-block">Input</span>
          <textarea
            name="inputFieldValue"
            placeholder="Enter input"
            value={inputFieldValue}
            rows={5}
            onChange={event => setInputFieldValue(event.target.value)}
            className="w-full rounded border px-4 py-2 "
          />
        </label>

        <Button type="submit" className="ml-auto" disabled={createEmbeddingKai.isLoading}>
          Submit
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl">Feature state</h2>
        <pre className="mt-8 max-h-[512px] w-full overflow-x-auto overflow-y-auto whitespace-pre-wrap rounded border   p-4">
          {JSON.stringify(createEmbeddingKai, null, 2)}
        </pre>
      </div>
    </PageContent>
  );
}
