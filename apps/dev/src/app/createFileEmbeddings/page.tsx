"use client";

import { useState } from "react";

import { eleganceClientKai } from "@/services/eleganceClient";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { PageContent } from "@/components/PageContent";
import { State } from "@/components/State";

export default function CreateFileEmbeddings() {
  const createFileEmbeddingsKai = eleganceClientKai.hooks.useCreateFileEmbeddings();
  const [file, setFile] = useState<File | null>(null);
  const [textField, setTextField] = useState("text");
  const [embeddingField, setEmbeddingField] = useState("embedding");
  const [chunkSize, setChunkSize] = useState(1000);

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = event => {
    event.preventDefault();
    if (!file) return;

    try {
      const reader = new FileReader();

      reader.onload = async event => {
        await createFileEmbeddingsKai.execute({
          dataURL: event.target!.result as string,
          textField,
          embeddingField,
          chunkSize
        });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageContent heading="Feature: CreateFileEmbeddings">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <Input
          label="File"
          type="file"
          accept=".csv,.pdf"
          disabled={createFileEmbeddingsKai.isLoading}
          onChange={files => setFile(files![0])}
        />

        <Input label="Text field" value={textField} onChange={setTextField} />
        <Input label="Embedding field" value={embeddingField} onChange={setEmbeddingField} />
        <Input label="Chunk size" type="number" min={1} value={chunkSize} onChange={value => setChunkSize(+value)} />

        <Button type="submit" className="ml-auto" disabled={createFileEmbeddingsKai.isLoading}>
          Submit
        </Button>
      </form>

      <State kaiState={createFileEmbeddingsKai} />
    </PageContent>
  );
}
