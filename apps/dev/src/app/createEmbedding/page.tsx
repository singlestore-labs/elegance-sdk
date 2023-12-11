"use client";

import { useState } from "react";

import { eleganceClientKai } from "@/services/eleganceClient";
import { Button } from "@/components/Button";
import { PageContent } from "@/components/PageContent";
import { State } from "@/components/State";
import { Textarea } from "@/components/Textarea";

export default function CreateEmbedding() {
  const createEmbeddingKai = eleganceClientKai.hooks.useCreateEmbedding();
  const [input, setInput] = useState("");

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    await createEmbeddingKai.execute({ input });
  };

  return (
    <PageContent heading="Feature: CreateEmbedding">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <Textarea label="Input" value={input} onChange={setInput} />

        <Button type="submit" className="ml-auto" disabled={createEmbeddingKai.isLoading}>
          Submit
        </Button>
      </form>

      <State kaiState={createEmbeddingKai} />
    </PageContent>
  );
}
