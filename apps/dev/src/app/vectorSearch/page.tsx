"use client";

import { useState } from "react";
import { CollectionOrTableField } from "@/components/CollectionOrTableField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/Button";

export default function VectorSearch() {
  const vectorSearchKai = eleganceClientKai.hooks.useVectorSearch();
  const vectorSearchMySQL = eleganceClientMySQL.hooks.useVectorSearch();
  const [connectionTypeValue, setConnectionTypeValue] = useState("kai");
  const [collectionValue, setCollectionValue] = useState("stars_data_embedding_csv");
  const [embeddingFieldValue, setEmbeddingFieldValue] = useState("embedding");
  const [limitValue, setLimitValue] = useState(5);
  const [queryValue, setQueryValue] = useState("");
  const activeState = connectionTypeValue === "kai" ? vectorSearchKai : vectorSearchMySQL;

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    if (!queryValue) return;

    if (connectionTypeValue === "kai") {
      await vectorSearchKai.execute({
        collection: collectionValue,
        embeddingField: embeddingFieldValue,
        limit: limitValue,
        query: queryValue
      });
    } else {
      await vectorSearchMySQL.execute({
        table: collectionValue,
        embeddingField: embeddingFieldValue,
        limit: limitValue,
        query: queryValue
      });
    }
  };

  return (
    <PageContent heading="Feature: VectorSearch">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionTypeValue} onChange={setConnectionTypeValue} />

        <CollectionOrTableField
          connectionType={connectionTypeValue}
          value={collectionValue}
          onChange={setCollectionValue}
        />

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
          <span className="mb-2 inline-block">Limit</span>
          <input
            type="number"
            min={0}
            name="limitValue"
            placeholder="Enter limit"
            value={limitValue}
            onChange={event => setLimitValue(+event.target.value)}
            className="w-full rounded border px-4 py-2 "
          />
        </label>

        <label className="w-full ">
          <span className="mb-2 inline-block">Query</span>
          <input
            name="queryValue"
            placeholder="Enter search query"
            value={queryValue}
            onChange={event => setQueryValue(event.target.value)}
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
