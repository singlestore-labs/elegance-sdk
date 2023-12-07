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

export default function DeleteMany() {
  const deleteManyKai = eleganceClientKai.hooks.useDeleteMany();
  const deleteManyMySQL = eleganceClientMySQL.hooks.useDeleteMany();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("users");
  const [filter, setFilter] = useState(JSON.stringify({ id: "657228661431372aef42ddcd" }, null, 2));
  const [where, setWhere] = useState('id = "657228391431372aef42ddc8"');

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();

    if (connectionType === "kai") {
      await deleteManyKai.execute({ db, collection, filter: JSON.parse(filter.trim()) });
    } else {
      await deleteManyMySQL.execute({ db, collection, where });
    }
  };

  return (
    <PageContent heading="Feature: DeleteMany">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionType} onChange={setConnectionType} />
        <DatabaseField value={db} onChange={setDb} />
        <CollectionField value={collection} onChange={setCollection} />

        {connectionType === "kai" ? (
          <Textarea label="Filter" value={filter} onChange={setFilter} />
        ) : (
          <Input label="Where" value={where} onChange={setWhere} />
        )}

        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>

      <State connectionType={connectionType} mysqlState={deleteManyMySQL} kaiState={deleteManyKai} />
    </PageContent>
  );
}
