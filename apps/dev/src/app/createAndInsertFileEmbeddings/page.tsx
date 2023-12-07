"use client";

import { useState } from "react";
import { ConnectionTypes } from "@singlestore/elegance-sdk/types";

import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { Button } from "@/components/Button";
import { CollectionField } from "@/components/CollectionField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { DatabaseField } from "@/components/DatabaseField";
import { Input } from "@/components/Input";
import { PageContent } from "@/components/PageContent";
import { State } from "@/components/State";

export default function CreateAndInsertFileEmbeddings() {
  const createAndInsertFileEmbeddingsKai = eleganceClientKai.hooks.useCreateAndInsertFileEmbeddings();
  const createAndInsertFileEmbeddingsMySQL = eleganceClientMySQL.hooks.useCreateAndInsertFileEmbeddings();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [chunkSize, setChunkSize] = useState(1000);
  const [textField, setTextField] = useState("text");
  const [embeddingField, setEmbeddingField] = useState("embedding");
  const activeState = connectionType === "kai" ? createAndInsertFileEmbeddingsKai : createAndInsertFileEmbeddingsMySQL;

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = event => {
    event.preventDefault();
    if (!file) return;

    try {
      const reader = new FileReader();

      reader.onload = async event => {
        const payload = {
          db,
          collection,
          dataURL: event.target!.result as string,
          chunkSize,
          textField,
          embeddingField
        };

        if (connectionType === "kai") {
          await createAndInsertFileEmbeddingsKai.execute(payload);
        } else {
          await createAndInsertFileEmbeddingsMySQL.execute(payload);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <PageContent heading="Feature: CreateAndInsertFileEmbeddings">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionType} onChange={setConnectionType} />
        <DatabaseField value={db} onChange={setDb} />
        <CollectionField value={collection} onChange={setCollection} />

        <Input
          label="File"
          type="file"
          accept=".csv,.pdf"
          disabled={activeState.isLoading}
          onChange={files => setFile(files![0])}
        />

        <Input label="Text field" value={textField} onChange={setTextField} />
        <Input label="Embedding field" value={embeddingField} onChange={setEmbeddingField} />
        <Input label="Chunk size" type="number" min={1} value={chunkSize} onChange={value => setChunkSize(+value)} />

        <Button type="submit" className="ml-auto" disabled={activeState.isLoading}>
          Submit
        </Button>
      </form>

      <State
        connectionType={connectionType}
        mysqlState={createAndInsertFileEmbeddingsMySQL}
        kaiState={createAndInsertFileEmbeddingsKai}
      />
    </PageContent>
  );
}
