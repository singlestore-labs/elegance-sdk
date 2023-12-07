"use client";

import { useState } from "react";
import { ConnectionTypes } from "@singlestore/elegance-sdk/types";

import { DB_NAME_MYSQL } from "@/constants";

import { eleganceClientKai, eleganceClientMySQL } from "@/services/eleganceClient";
import { Button } from "@/components/Button";
import { CollectionField } from "@/components/CollectionField";
import { ConnectionTypeSelect } from "@/components/ConnectionTypeSelect";
import { DatabaseField } from "@/components/DatabaseField";
import { PageContent } from "@/components/PageContent";
import { State } from "@/components/State";
import { Textarea } from "@/components/Textarea";

export default function Query() {
  const queryKai = eleganceClientKai.hooks.useQuery();
  const queryMySQL = eleganceClientMySQL.hooks.useQuery();
  const [connectionType, setConnectionType] = useState<ConnectionTypes>("mysql");
  const [db, setDb] = useState("");
  const [collection, setCollection] = useState("books");
  const [mysqlQuery, setMysqlQuery] = useState(`SELECT * FROM ${DB_NAME_MYSQL}.books LIMIT 5`);
  const [aggregateQuery, setAggregateQuery] = useState(JSON.stringify([{ $match: {} }, { $limit: 5 }], null, 2));

  const handleSubmit: JSX.IntrinsicElements["form"]["onSubmit"] = async event => {
    event.preventDefault();

    if (connectionType === "kai") {
      if (!aggregateQuery) return;
      await queryKai.execute({
        db,
        collection,
        pipeline: JSON.parse(aggregateQuery.trim())
      });
    } else {
      if (!mysqlQuery) return;
      await queryMySQL.execute({ query: mysqlQuery });
    }
  };

  return (
    <PageContent heading="Feature: Query">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <ConnectionTypeSelect value={connectionType} onChange={setConnectionType} />

        {connectionType === "kai" ? (
          <>
            <DatabaseField value={db} onChange={setDb} />
            <CollectionField value={collection} onChange={setCollection} />
            <Textarea label="Agreggate query (JSON)" value={aggregateQuery} onChange={setAggregateQuery} />
          </>
        ) : (
          <Textarea label="MySQL query" value={mysqlQuery} onChange={setMysqlQuery} />
        )}

        <Button type="submit" className="ml-auto">
          Submit
        </Button>
      </form>

      <State connectionType={connectionType} mysqlState={queryMySQL} kaiState={queryKai} />
    </PageContent>
  );
}
