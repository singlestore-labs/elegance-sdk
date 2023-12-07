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

export default function FindMany() {
  const findManyKai = eleganceClientKai.hooks.useFindMany();
  const findManyMySQL = eleganceClientMySQL.hooks.useFindMany();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("books");
  const [filter, setFilter] = useState(JSON.stringify({ title: "Back to nature" }, null, 2));
  const [where, setWhere] = useState('title = "Back to nature"');
  const [limit, setLimit] = useState(5);
  const [skip, setSkip] = useState(0);

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();

    if (connectionType === "kai") {
      await findManyKai.execute({
        db,
        collection,
        filter: filter ? JSON.parse(filter.trim()) : undefined,
        options: { skip, limit }
      });
    } else {
      await findManyMySQL.execute({ db, collection, where, skip, limit });
    }
  };

  return (
    <PageContent heading="Feature: FindMany">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionType} onChange={setConnectionType} />
        <DatabaseField value={db} onChange={setDb} />
        <CollectionField value={collection} onChange={setCollection} />

        {connectionType === "kai" ? (
          <Textarea label="Filter" value={filter} onChange={setFilter} />
        ) : (
          <Input label="Where" value={where} onChange={setWhere} />
        )}

        <Input label="Limit" type="number" min={0} value={limit} onChange={value => setLimit(+value)} />
        <Input label="Skip" type="number" min={0} value={skip} onChange={value => setSkip(+value)} />

        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>

      <State connectionType={connectionType} mysqlState={findManyMySQL} kaiState={findManyKai} />
    </PageContent>
  );
}
