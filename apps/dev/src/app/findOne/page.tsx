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

export default function FindOne() {
  const findOneKai = eleganceClientKai.hooks.useFindOne();
  const findOneMySQL = eleganceClientMySQL.hooks.useFindOne();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("books");
  const [filter, setFilter] = useState(JSON.stringify({ title: "Back to nature" }, null, 2));
  const [where, setWhere] = useState('title = "Back to nature"');

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();

    if (connectionType === "kai") {
      await findOneKai.execute({ db, collection, filter: filter ? JSON.parse(filter.trim()) : undefined });
    } else {
      await findOneMySQL.execute({ db, collection, where });
    }
  };

  return (
    <PageContent heading="Feature: FindOne">
      <form className="mt-12 flex flex-col gap-4" onSubmit={handleSubmit}>
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

      <State connectionType={connectionType} mysqlState={findOneMySQL} kaiState={findOneKai} />
    </PageContent>
  );
}
