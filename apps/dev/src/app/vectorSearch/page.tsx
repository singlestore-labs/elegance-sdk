"use client";

import { useState } from "react";
import { ConnectionTypes, VectorSearchBody } from "@singlestore/elegance-sdk/types";

import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { Button } from "@/components/Button";
import { CollectionField } from "@/components/CollectionField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { DatabaseField } from "@/components/DatabaseField";
import { Input } from "@/components/Input";
import { PageContent } from "@/components/PageContent";
import { State } from "@/components/State";
import { Checkbox } from "@/components/Checkbox";

export default function VectorSearch() {
  const vectorSearchKai = eleganceClientKai.hooks.useVectorSearch();
  const vectorSearchMySQL = eleganceClientMySQL.hooks.useVectorSearch();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("");
  const [embeddingField, setEmbeddingField] = useState("embedding");
  const [minSimilarity, setMinSimilarity] = useState(0.7);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState("");
  const [includeEmbedding, setIncludeEmbedding] = useState(false);

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    if (!query) return;

    const body: VectorSearchBody = {
      db,
      collection,
      embeddingField,
      limit,
      query,
      minSimilarity,
      includeEmbedding
    };

    if (connectionType === "kai") {
      await vectorSearchKai.execute(body);
    } else {
      await vectorSearchMySQL.execute(body);
    }
  };

  return (
    <PageContent heading="Feature: VectorSearch">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionType} onChange={setConnectionType} />
        <DatabaseField value={db} onChange={setDb} />
        <CollectionField value={collection} onChange={setCollection} />
        <Input label="Embedding field" value={embeddingField} onChange={setEmbeddingField} />
        <Input label="Limit" type="number" min={0} value={limit} onChange={value => setLimit(+value)} />
        <Checkbox label="Include embedding" value={includeEmbedding} onChange={setIncludeEmbedding} />

        <Input
          label="Min similarity"
          type="number"
          min={0.0}
          step={0.01}
          value={minSimilarity}
          onChange={value => setMinSimilarity(+value)}
        />

        <Input label="Query" value={query} onChange={setQuery} />

        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>

      <State connectionType={connectionType} mysqlState={vectorSearchMySQL} kaiState={vectorSearchKai} />
    </PageContent>
  );
}
