"use client";

import { useState } from "react";
import { CollectionOrTableField } from "@/components/CollectionOrTableField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/Button";
import { DB_NAME } from "@/constants";

export default function FindMany() {
  const findManyKai = eleganceClientKai.hooks.useFindMany();
  const findManyMySQL = eleganceClientMySQL.hooks.useFindMany();
  const [connectionTypeValue, setConnectionTypeValue] = useState("kai");
  const [dbNameValue, setDbNameValue] = useState(DB_NAME);
  const [collectionValue, setCollectionValue] = useState(DB_NAME);
  const [filterValue, setFilterValue] = useState(JSON.stringify({ name: "Polaris" }, null, 2));
  const [whereValue, setWhereValue] = useState('name = "Polaris"');
  const [limitValue, setLimitValue] = useState(5);
  const [skipValue, setSkipValue] = useState(0);
  const activeState = connectionTypeValue === "kai" ? findManyKai : findManyMySQL;

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    const filter = filterValue ? JSON.parse(filterValue.trim()) : undefined;

    if (connectionTypeValue === "kai") {
      await findManyKai.execute({
        collection: collectionValue,
        filter,
        options: { skip: skipValue, limit: limitValue }
      });
    } else {
      await findManyMySQL.execute({
        db: dbNameValue,
        collection: collectionValue,
        where: whereValue,
        skip: skipValue,
        limit: limitValue
      });
    }
  };

  return (
    <PageContent heading="Feature: FindMany">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionTypeValue} onChange={setConnectionTypeValue} />

        {connectionTypeValue === "mysql" ? (
          <label className="w-full ">
            <span className="mb-2 inline-block">Database</span>
            <input
              value={dbNameValue}
              onChange={event => setDbNameValue(event.target.value)}
              placeholder={`Enter database name`}
              className="w-full rounded border px-4 py-2 "
            />
          </label>
        ) : null}

        <CollectionOrTableField
          connectionType={connectionTypeValue}
          value={collectionValue}
          onChange={setCollectionValue}
        />

        {connectionTypeValue === "kai" ? (
          <label className="w-full ">
            <span className="mb-2 inline-block">Filter</span>
            <textarea
              placeholder="Enter filter"
              rows={5}
              value={filterValue}
              onChange={event => setFilterValue(event.target.value)}
              className="w-full rounded border px-4 py-2 "
            />
          </label>
        ) : (
          <label className="w-full ">
            <span className="mb-2 inline-block">Where</span>
            <input
              placeholder="Enter where query"
              value={whereValue}
              onChange={event => setWhereValue(event.target.value)}
              className="w-full rounded border px-4 py-2 "
            />
          </label>
        )}

        <label className="w-full ">
          <span className="mb-2 inline-block">Limit</span>
          <input
            type="number"
            min="0"
            name="limitValue"
            placeholder="Limit"
            value={limitValue}
            onChange={event => setLimitValue(+event.target.value)}
            className="w-full rounded border px-4 py-2 "
          />
        </label>

        <label className="w-full ">
          <span className="mb-2 inline-block">Skip</span>
          <input
            type="number"
            min="0"
            name="skipValue"
            placeholder="Skip"
            value={skipValue}
            onChange={event => setSkipValue(+event.target.value)}
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
