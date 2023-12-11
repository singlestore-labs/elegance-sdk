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

export default function InsertMany() {
  const insertManyKai = eleganceClientKai.hooks.useInsertMany();
  const insertManyMySQL = eleganceClientMySQL.hooks.useInsertMany();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("users");
  const [values, setValues] = useState(JSON.stringify([{ reviews: "[]" }, { reviews: "[]" }], null, 2));
  const [generateId, setGenerateId] = useState(true);

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();
    const _values = values ? JSON.parse(values.trim()) : undefined;

    if (connectionType === "kai") {
      await insertManyKai.execute({ db, collection, generateId, values: _values });
    } else {
      await insertManyMySQL.execute({ db, collection, generateId, values: _values });
    }
  };

  return (
    <PageContent heading="Feature: InsertMany">
      <form className="mt-12 flex flex-col gap-4 " onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionType} onChange={setConnectionType} />
        <DatabaseField value={db} onChange={setDb} />
        <CollectionField value={collection} onChange={setCollection} />
        <Textarea label="Values" value={values} onChange={setValues} />
        <Checkbox label="Generate IDs" value={generateId} onChange={setGenerateId} />

        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>

      <State connectionType={connectionType} mysqlState={insertManyMySQL} kaiState={insertManyKai} />
    </PageContent>
  );
}
