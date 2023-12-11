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
import { Textarea } from "@/components/Textarea";

export default function UpdateMany() {
  const updateManyKai = eleganceClientKai.hooks.useUpdateMany();
  const updateManyMySQL = eleganceClientMySQL.hooks.useUpdateMany();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("users");
  const [filter, setFilter] = useState(JSON.stringify({ id: "657228661431372aef42ddcd" }, null, 2));
  const [update, setUpdate] = useState(JSON.stringify({ $set: { reviews: [1, 2, 3] } }, null, 2));
  const [updatedFilter, setUpdatedFilter] = useState(JSON.stringify({ id: "657228661431372aef42ddcd" }, null, 2));

  const [where, setWhere] = useState('id = "657228391431372aef42ddc8"');
  const [set, setSet] = useState('reviews = "[1,2,3]"');
  const [updatedWhere, setUpdatedWhere] = useState('id = "657228391431372aef42ddc8"');

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();

    if (connectionType === "kai") {
      await updateManyKai.execute({
        db,
        collection,
        filter: JSON.parse(filter.trim()),
        update: JSON.parse(update.trim()),
        updatedFilter: JSON.parse(updatedFilter.trim())
      });
    } else {
      await updateManyMySQL.execute({
        db,
        collection,
        where,
        set,
        updatedWhere
      });
    }
  };

  return (
    <PageContent heading="Feature: UpdateMany">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionType} onChange={setConnectionType} />
        <DatabaseField value={db} onChange={setDb} />
        <CollectionField value={collection} onChange={setCollection} />

        {connectionType === "kai" ? (
          <>
            <Textarea label="Filter" value={filter} onChange={setFilter} />
            <Textarea label="Update" value={update} onChange={setUpdate} />
            <Textarea label="Updated Filter" value={updatedFilter} onChange={setUpdatedFilter} />
          </>
        ) : (
          <>
            <Input label="Where" value={where} onChange={setWhere} />
            <Input label="Set" value={set} onChange={setSet} />
            <Input label="Updated where" value={updatedWhere} onChange={setUpdatedWhere} />
          </>
        )}

        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>

      <State connectionType={connectionType} mysqlState={updateManyMySQL} kaiState={updateManyKai} />
    </PageContent>
  );
}
