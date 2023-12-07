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

export default function VectorSearch() {
  const vectorSearchKai = eleganceClientKai.hooks.useVectorSearch();
  const vectorSearchMySQL = eleganceClientMySQL.hooks.useVectorSearch();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("");
  const [embeddingField, setEmbeddingField] = useState("embedding");
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState("");

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    if (!query) return;

    if (connectionType === "kai") {
      await vectorSearchKai.execute({ db, collection, embeddingField, limit, query });
    } else {
      await vectorSearchMySQL.execute({ db, collection, embeddingField, limit, query });
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
        <Input label="Query" value={query} onChange={setQuery} />

        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>

      <State connectionType={connectionType} mysqlState={vectorSearchMySQL} kaiState={vectorSearchKai} />
    </PageContent>
  );
}
