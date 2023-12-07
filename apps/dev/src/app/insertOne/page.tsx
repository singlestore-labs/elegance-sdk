"use client";

import { useState } from "react";
import { ConnectionTypes } from "@singlestore/elegance-sdk/types";

import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { Button } from "@/components/Button";
import { Checkbox } from "@/components/Checkbox";
import { CollectionField } from "@/components/CollectionField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { DatabaseField } from "@/components/DatabaseField";
import { PageContent } from "@/components/PageContent";
import { State } from "@/components/State";
import { Textarea } from "@/components/Textarea";

export default function InsertOne() {
  const insertOneKai = eleganceClientKai.hooks.useInsertOne();
  const insertOneMySQL = eleganceClientMySQL.hooks.useInsertOne();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("users");
  const [value, setValue] = useState(JSON.stringify({ reviews: [] }, null, 2));
  const [generateId, setGenerateId] = useState(true);

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    const _value = value ? JSON.parse(value.trim()) : undefined;

    if (connectionType === "kai") {
      await insertOneKai.execute({ db, collection, generateId, value: _value });
    } else {
      await insertOneMySQL.execute({ db, collection, generateId, value: _value });
    }
  };

  return (
    <PageContent heading="Feature: InsertOne">
      <form className="mt-12 flex flex-col gap-4" onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionType} onChange={setConnectionType} />
        <DatabaseField value={db} onChange={setDb} />
        <CollectionField value={collection} onChange={setCollection} />
        <Textarea label="Value" value={value} onChange={setValue} />
        <Checkbox label="Generate ID" value={generateId} onChange={setGenerateId} />
        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>

      <State connectionType={connectionType} mysqlState={insertOneMySQL} kaiState={insertOneKai} />
    </PageContent>
  );
}
