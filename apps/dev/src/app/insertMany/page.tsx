"use client";

import { useState, useEffect } from "react";
import { CollectionOrTableField } from "@/components/CollectionOrTableField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { PageContent } from "@/components/PageContent";
import { Button } from "@/components/Button";

const collections = {
  kai: "test_insert_kai",
  mysql: "test_insert_mysql"
};

export default function InsertMany() {
  const insertManyKai = eleganceClientKai.hooks.useInsertMany();
  const insertManyMySQL = eleganceClientMySQL.hooks.useInsertMany();
  const [connectionTypeValue, setConnectionTypeValue] = useState<keyof typeof collections>("kai");
  const [collectionValue, setCollectionValue] = useState(collections[connectionTypeValue]);
  const [values, setValues] = useState(JSON.stringify([{ name: "1" }, { name: "2" }], null, 2));
  const activeState = connectionTypeValue === "kai" ? insertManyKai : insertManyMySQL;

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    const _values = values ? JSON.parse(values.trim()) : undefined;

    if (connectionTypeValue === "kai") {
      await insertManyKai.execute({ collection: collectionValue, values: _values });
    } else {
      await insertManyMySQL.execute({ collection: collectionValue, values: _values });
    }
  };

  useEffect(() => {
    setCollectionValue(collections[connectionTypeValue]);
  }, [connectionTypeValue]);

  return (
    <PageContent heading="Feature: InsertMany">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionTypeValue} onChange={v => setConnectionTypeValue(v as any)} />

        <CollectionOrTableField
          connectionType={connectionTypeValue}
          value={collectionValue}
          onChange={setCollectionValue}
        />

        <label className="w-full ">
          <span className="mb-2 inline-block">Values</span>
          <textarea
            name="values"
            placeholder="Enter values"
            rows={10}
            value={values}
            onChange={event => setValues(event.target.value)}
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
