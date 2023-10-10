"use client";

import { useState } from "react";
import { CollectionOrTableField } from "@/components/CollectionOrTableField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/Button";
import { DB_NAME } from "@/constants";

export default function Query() {
  const queryKai = eleganceClientKai.hooks.useQuery();
  const queryMySQL = eleganceClientMySQL.hooks.useQuery();
  const [connectionTypeValue, setConnectionTypeValue] = useState("kai");
  const [collectionValue, setCollectionValue] = useState(DB_NAME);
  const [mysqlQueryValue, setMysqlQueryValue] = useState(`SELECT * FROM ${DB_NAME}`);
  const [aggregateQueryValue, setAggregateQueryValue] = useState(
    JSON.stringify([{ $match: {} }, { $limit: 5 }], null, 2)
  );

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();

    if (connectionTypeValue === "kai") {
      if (!aggregateQueryValue) return;
      await queryKai.execute({
        collection: collectionValue,
        pipeline: JSON.parse(aggregateQueryValue.trim())
      });
    } else {
      if (!mysqlQueryValue) return;
      await queryMySQL.execute({ query: mysqlQueryValue });
    }
  };

  return (
    <PageContent heading="Feature: Query">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionTypeValue} onChange={setConnectionTypeValue} />

        <CollectionOrTableField
          connectionType={connectionTypeValue}
          value={collectionValue}
          onChange={setCollectionValue}
        />

        {connectionTypeValue === "kai" ? (
          <label className="w-full">
            <span className="mb-2 inline-block">Agreggate query (JSON)</span>
            <textarea
              name="aggregateQueryValue"
              placeholder="Enter aggregate query"
              rows={10}
              value={aggregateQueryValue}
              onChange={event => setAggregateQueryValue(event.target.value)}
              className="w-full rounded border  px-4 py-2"
            />
          </label>
        ) : (
          <label className="w-full">
            <span className="mb-2 inline-block">MySQL query</span>
            <textarea
              name="mysqlQueryValue"
              placeholder="Enter MySQL query"
              rows={5}
              value={mysqlQueryValue}
              onChange={event => setMysqlQueryValue(event.target.value)}
              className="w-full rounded border  px-4 py-2"
            />
          </label>
        )}

        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>

      <div className="mt-8">
        <h2 className="text-xl">Feature state</h2>
        <pre className="mt-8 max-h-[512px] w-full overflow-x-auto overflow-y-auto whitespace-pre-wrap rounded border p-4">
          {JSON.stringify(connectionTypeValue === "kai" ? queryKai : queryMySQL, null, 2)}
        </pre>
      </div>
    </PageContent>
  );
}
