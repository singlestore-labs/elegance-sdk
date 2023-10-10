"use client";

import { useState } from "react";
import { CollectionOrTableField } from "@/components/CollectionOrTableField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/Button";

export default function CreateAndInsertFileEmbeddings() {
  const createAndInsertFileEmbeddingsKai = eleganceClientKai.hooks.useCreateAndInsertFileEmbeddings();
  const createAndInsertFileEmbeddingsMySQL = eleganceClientMySQL.hooks.useCreateAndInsertFileEmbeddings();
  const [connectionTypeValue, setConnectionTypeValue] = useState("kai");
  const [collectionValue, setCollectionValue] = useState("stars_data_embedding_csv");
  const [file, setFile] = useState<File | null>(null);
  const [chunkSizeValue, setChunkSizeValue] = useState(1000);
  const [textFieldValue, setTextFieldValue] = useState("text");
  const [embeddingFieldValue, setEmbeddingFieldValue] = useState("embedding");
  const activeState =
    connectionTypeValue === "kai" ? createAndInsertFileEmbeddingsKai : createAndInsertFileEmbeddingsMySQL;

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = event => {
    event.preventDefault();
    if (!file) return;

    try {
      const reader = new FileReader();

      reader.onload = async event => {
        const payload = {
          dataURL: event.target!.result as string,
          chunkSize: chunkSizeValue,
          textField: textFieldValue,
          embeddingField: embeddingFieldValue
        };

        if (connectionTypeValue === "kai") {
          await createAndInsertFileEmbeddingsKai.execute({ ...payload, collection: collectionValue });
        } else {
          await createAndInsertFileEmbeddingsMySQL.execute({ ...payload, table: collectionValue });
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
        <ConnectionTypeSelect value={connectionTypeValue} onChange={setConnectionTypeValue} />

        <CollectionOrTableField
          connectionType={connectionTypeValue}
          value={collectionValue}
          onChange={setCollectionValue}
        />

        <label className="w-full ">
          <span className="mb-2 inline-block">File</span>
          <input
            type="file"
            accept=".csv,.pdf"
            disabled={activeState.isLoading}
            onChange={e => setFile(e.target.files![0])}
            className="w-full rounded border px-4 py-2 "
          />
        </label>

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

        <label className="w-full ">
          <span className="mb-2 inline-block">ChunkSize</span>
          <input
            type="number"
            min={1}
            name="chunkSizeValue"
            placeholder="Enter aggregate createAndInsertFileEmbeddings"
            value={chunkSizeValue}
            onChange={event => setChunkSizeValue(+event.target.value)}
            className="w-full rounded border px-4 py-2 "
          />
        </label>

        <Button type="submit" className="ml-auto" disabled={activeState.isLoading}>
          Submit
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl">Feature state</h2>
        <pre className="mt-8 max-h-[512px] w-full overflow-x-auto overflow-y-auto whitespace-pre-wrap rounded border   p-4">
          {JSON.stringify(activeState, null, 2)}
        </pre>
      </div>
    </PageContent>
  );
}
