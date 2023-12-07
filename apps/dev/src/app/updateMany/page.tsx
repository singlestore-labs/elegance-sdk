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

export default function UpdateMany() {
  const updateManyKai = eleganceClientKai.hooks.useUpdateMany();
  const updateManyMySQL = eleganceClientMySQL.hooks.useUpdateMany();
  const [connectionTypeValue, setConnectionTypeValue] = useState<"kai" | "mysql">("kai");
  const [collectionValue, setCollectionValue] = useState(collections[connectionTypeValue]);

  const [filterValue, setFilterValue] = useState(JSON.stringify({ name: "Polaris" }, null, 2));
  const [updateValue, setUpdateValue] = useState(JSON.stringify({ $set: { name: "Updated Name" } }, null, 2));
  const [updatedFilterValue, setUpdatedFilterValue] = useState(JSON.stringify({ name: "Updated Name" }, null, 2));

  const [whereValue, setWhereValue] = useState('name = "Polaris"');
  const [setValue, setSetValue] = useState('name = "Updated Name"');
  const [updatedWhereValue, setUpdatedWhereValue] = useState('name = "Updated Name"');

  const activeState = connectionTypeValue === "kai" ? updateManyKai : updateManyMySQL;

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();

    if (connectionTypeValue === "kai") {
      await updateManyKai.execute({
        collection: collectionValue,
        filter: JSON.parse(filterValue.trim()),
        update: JSON.parse(updateValue.trim()),
        updatedFilter: JSON.parse(updatedFilterValue.trim())
      });
    } else {
      await updateManyMySQL.execute({
        collection: collectionValue,
        where: whereValue,
        set: setValue,
        updatedWhere: updatedWhereValue
      });
    }
  };

  useEffect(() => {
    setCollectionValue(collections[connectionTypeValue]);
  }, [connectionTypeValue]);

  return (
    <PageContent heading="Feature: UpdateMany">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionTypeValue} onChange={v => setConnectionTypeValue(v as any)} />

        <CollectionOrTableField
          connectionType={connectionTypeValue}
          value={collectionValue}
          onChange={setCollectionValue}
        />

        {connectionTypeValue === "kai" ? (
          <>
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

            <label className="w-full ">
              <span className="mb-2 inline-block">Update</span>
              <textarea
                placeholder="Enter updated value"
                rows={5}
                value={updateValue}
                onChange={event => setUpdateValue(event.target.value)}
                className="w-full rounded border px-4 py-2 "
              />
            </label>

            <label className="w-full ">
              <span className="mb-2 inline-block">Updated Filter</span>
              <textarea
                placeholder="Enter updated filter"
                rows={5}
                value={updatedFilterValue}
                onChange={event => setUpdatedFilterValue(event.target.value)}
                className="w-full rounded border px-4 py-2 "
              />
            </label>
          </>
        ) : (
          <>
            <label className="w-full ">
              <span className="mb-2 inline-block">Where</span>
              <input
                placeholder="Enter where query"
                value={whereValue}
                onChange={event => setWhereValue(event.target.value)}
                className="w-full rounded border px-4 py-2 "
              />
            </label>

            <label className="w-full ">
              <span className="mb-2 inline-block">Set</span>
              <textarea
                placeholder="Enter set value"
                rows={5}
                value={setValue}
                onChange={event => setSetValue(event.target.value)}
                className="w-full rounded border px-4 py-2 "
              />
            </label>

            <label className="w-full ">
              <span className="mb-2 inline-block">Updated where</span>
              <input
                placeholder="Enter updated where query"
                value={updatedWhereValue}
                onChange={event => setUpdatedWhereValue(event.target.value)}
                className="w-full rounded border px-4 py-2 "
              />
            </label>
          </>
        )}

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
