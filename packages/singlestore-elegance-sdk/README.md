# SingleStore Elegance SDK

The Elegance SDK is an SDK for quickly building real-time AI full-stack JavaScript applications using SingleStoreDB with support for MySQL and Kai (support for Mongo APIs) connection types and the OpenAI API. It provides a set of ready-made tools for implementing various types of functionality when you need to transact, analyze, and contextualize data in real-time or build real-time AI apps.

## Features

- Vector search
- Chat completions
- File embeddings generation (csv, pdf)
- SQL and aggregate queries
- SQL and Kai (MongoDB) database connections support
- Ready-to-use Node.js controllers and React.js hooks

## Installation

```sh
npm install @singlestore/elegance-sdk
```

## Usage

This guide will show you how to use the SDK in Express.js and React.js.

1. Create a `eleganceServerClient.ts` file
2. Import the `createEleganceServerClient` function from `@singlestore/elegance-sdk/server`

```tsx
// ./server/services/eleganceServerClient.ts
import { createEleganceServerClient } from "@singlestore/elegance-sdk/server";

export const eleganceServerClient = createEleganceServerClient("mysql", {
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  },
  ai: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY
    }
  }
});
```

3. Create a route handler for `elegance/:route` (using Express.js as an example).

```tsx
// ./server/routes/elegance.ts
import express from "express";
import type { Routes } from "@singlestore/elegance-sdk/server";
import { eleganceServerClient } from "@/services/eleganceServerClient";

export const eleganceRouter = express.Router();

eleganceRouter.post("/elegance/:route", async (req, res) => {
  try {
    const route = req.params.route as Routes;
    const result = await eleganceServerClient.handleRoute(route, req.body);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(error.status).json(error);
  }
});
```

4. Import the eleganceRouter into the `./server/index.ts`

```tsx
// ./server/index.ts
import express from "express";
import { eleganceRouter } from "./routes/elegance";

const app = express();

app.use(eleganceRouter);

app.listen(4000, () => {
  console.log(`Server started on port: ${4000}`);
});
```

5. Run your server
6. Create a `eleganceClient.ts` file
7. Import the `createEleganceClient` function from `@singlestore/elegance-sdk`

```tsx
// ./client/services/eleganceClient.ts
import { createEleganceClient } from "@singlestore/elegance-sdk";

export const eleganceClient = createEleganceClient("mysql", {
  baseURL: "http://localhost:4000"
});
```

7. Import the `eleganceClient` to your component

```tsx
// ./client/components/ExampleComponent.tsx
import { useEffect } from "react";
import { eleganceClient } from "@/services/eleganceClient";

export function ExampleComponent() {
  const query = eleganceClient.hooks.useQuery<{ name: string }[]>({ initialValue: [], initialIsLoading: true });
  const { execute: executeQuery } = query;

  useEffect(() => {
    executeQuery({ query: "SELECT name FROM table LIMIT 3" });
  }, [executeQuery]);

  if (query.isLoading) return "Loading...";

  return (
    <div>
      {query.value.map(item => (
        <h4 key={item.name}>{item.name}</h4>
      ))}
    </div>
  );
}
```

8. Run your client

## Templates

You can find templates using the Elegance SDK here:

- [Next.js Template](https://github.com/singlestore-labs/elegance-sdk-template-next)
- [Express.js Template](https://github.com/singlestore-labs/elegance-sdk-template-express)

## Example apps

You can find example apps using the Elegance SDK here:

- [Books Chat](https://github.com/singlestore-labs/elegance-sdk-app-books-chat)

## API

#### createEleganceServerClient

Creates an EleganceServerClient instance for a server.

**Parameters:**

- `connectionType: "kai" | "mysql"`
- ```tsx
  config: {
    connection: KaiConnectionConfig | MySQLConnectionConfig;
    ai?: {
      openai?: OpenAIConfig;
      customizers?: {
        createEmbedding?: (input: EmbeddingInput) => Promise<Embedding[]>;
        createChatCompletion?: (body: CreateChatCompletionBody) => Promise<string | null>;
      } // You can use your own functions to create an embedding or a chat completion.
    };
  }
  ```

**Returns:** `eleganceServerClient`

#### eleganceServerClient

Server client that includes a database connection, controllers and AI client. It's used on the server to handle requests from the client and execute logic.

#### eleganceServerClient.connection

MySQL or MongoDB connection to interact with a database

#### eleganceServerClient.handleRoute

Accepts a route and executes the controller for that route.

**Parameters:**

- `route: string` - controller route name
- `body: object` - controller body

#### eleganceServerClient.controllers.insertOne\<T>

Inserts one record.

**Parameters:**

```tsx
body: {
    db?: string; // Database name
    collection: string; // Collection name
    generateId?: boolean; // Generates the `id` string field
    value: MongoOptionalUnlessRequiredId<T>; // Value to insert
    options?: MongoInsertOneOptions;
  } | {
    db?: string;
    collection: string;
    generateId?: boolean;
    value: T;
  }
```

**Returns:** `T`

#### eleganceServerClient.controllers.insertMany<Array\<T>>

Inserts many records.

**Parameters:**

```tsx
body: {
    db?: string; // Database name
    collection: string; // Collection name
    values: Array<MongoOptionalUnlessRequiredId<T[number]>>; // Values to insert
    generateId?: boolean; // Generates the `id` string field
    options?: MongoBulkWriteOptions;
  } | {
    db?: string;
    collection: string;
    generateId?: boolean;
    values: Array<T>;
  }
```

**Returns:** `Array<T>`

#### eleganceServerClient.controllers.updateMany<Array\<T>>

Updates many records.

**Parameters:**

```tsx
body: {
    db?: string; // Database name
    collection: string; // Collection name
    filter: MongoFilter<T[number]>; // Filter to find records to update
    update: MongoUpdateFilter<T[number]>;
    options?: MongoUpdateOptions;
    updatedFilter?: MongoFilter<T[number]>; // Filter to find updated records
  } | {
    db?: string;
    collection: string;
    where: MySQLWhere; // MySQL WHERE string value to find records to update
    set: MySQLSet; // MySQL SET string value
    updatedWhere: MySQLWhere; // MySQL WHERE string value to find updated records
  }
```

**Returns:** `Array<T>`

#### eleganceServerClient.controllers.deleteMany\<T>

Deletes many records.

**Parameters:**

```tsx
body: {
    db?: string; // Database name
    collection: string; // Collection name
    filter: MongoFilter<T>; // Filter to find records to delete
    options?: MongoDeleteOptions;
  } | {
    db?: string;
    collection: string;
    where: MySQLWhere; // MySQL WHERE string value to find records to delete
  }
```

**Returns:** `{ message: string }`

#### eleganceServerClient.controllers.findOne\<T>

Gets one record.

**Parameters:**

```tsx
body: {
    db?: string; // Database name
    collection: string; // Collection name
    filter?: MongoFilter<T>; // Filter to find a record
    options?: MongoFindOptions;
  } | {
    db?: string;
    collection: string;
    columns?: string[]; // Columns to get by default *
    where?: MySQLWhere; // MySQL WHERE string value to find a record
  }
```

**Returns:** `T`

#### eleganceServerClient.controllers.findMany<Array\<T>>

Gets many records.

**Parameters:**

```tsx
body: {
    db?: string; // Database name
    collection: string; // Collection name
    filter?: MongoFilter<T[number]>; // Filter to find records
    options?: MongoFindOptions;
  } | {
    db?: string;
    collection: string;
    columns?: string[]; // Columns to get by default *
    where?: MySQLWhere; // MySQL WHERE string value to find records
    skip?: number;
    limit?: number;
  }
```

**Returns:** `Array<object>`

#### eleganceServerClient.controllers.query<Array\<T>>

Executes MySQL or aggregate query.

**Parameters:**

```tsx
body: {
    db?: string; // Database name
    collection: string; // Collection name
    query: object[]; // Aggregate query
    options?: MongoAggregateOptions;
  } | {
    query: string; // MySQL query
  }
```

**Returns:** `Array<T>`

#### eleganceServerClient.controllers.createEmbedding

Creates embedding.

**Parameters:**

```tsx
body: {
  input: string | string[] | object | object[];
}
```

**Returns:** `Embedding`

#### eleganceServerClient.controllers.vectorSearch

Performs vector search in the collection based on the query.

**Parameters:**

```tsx
body: {
    db?: string; // Database name
    collection: string; // Collection name
    embeddingField: string; // Field name with the embedding by which to perform the search
    query: string; // Search query
    limit?: number; // Number of records to get
  }
```

**Returns:** `Array<object>`

#### eleganceServerClient.controllers.chatCompletion

Accepts a prompt, performs vector search, and creates chat completion for the found records.

**Parameters:**

```tsx
body: {
    db?: string; // Database name
    collection: string; // Collection name
    prompt: string; // Prompt text
    model?: string;
    textField?: string; // Field name by which to create a chat completion
    embeddingField?: string; // Field name with the embedding by which to perform the search
    minSimilarity?: number; // Minimum similarity number to filter search results, used to create a chat completion.
    systemRole?: string; // Initial system role
    messages?: CreateChatCompletionBody["messages"]; // Additional messages after the prompt message
    maxTokens?: CreateChatCompletionBody["max_tokens"];
    maxContextLength?: number;
    temperature?: CreateChatCompletionBody["temperature"];
  }
```

**Returns:**

```tsx
{
  content: string;
  context: string;
}
```

#### eleganceServerClient.controllers.createFileEmbeddings

Accepts a CSV or PDF file as a DataURL, splits it into chunks and creates embeddings.

**Parameters:**

```tsx
body: {
    file?: // CSV or PDF file
    dataURL?: string; // CSV or PDF file DataURL
    textField?: string; // Field name in which to save a chunk text
    embeddingField?: string; // Field name in which to save an embedding
    chunkSize?: number;
  }
```

**Returns:** `Array<{ text: string; embedding: Embedding; }>`

#### eleganceServerClient.controllers.createAndInsertFileEmbeddings

Accepts a CSV or PDF file as a DataURL, splits it into chunks, creates embeddings, and inserts them into a database.

**Parameters:**

```tsx
body: {
    db?: string; // Database name
    collection: string; // Collection name
    file?: // CSV or PDF file
    dataURL?: string; // CSV or PDF file DataURL
    textField?: string; // Field name in which to save a chunk text
    embeddingField?: string; // Field name in which to save an embedding
    chunkSize?: number;
  }
```

**Returns:** `Array<{ text: string; embedding: Embedding; }>`

#### eleganceServerClient.ai.openai

Default OpenAI client

#### eleganceServerClient.ai.createEmbedding

Creates embedding

**Parameters:**

- `input: string | Array<string> | object | Array<object>` - input value

**Returns:** `Embedding`

#### eleganceServerClient.ai.embeddingToBuffer

Converts an embedding into a buffer that is then inserted into the database.

**Parameters:**

- `embedding: Embedding`

**Returns:** `Buffer`

#### eleganceServerClient.ai.textToEmbeddings

Converts text into embeddings by splitting the text into chunks.

**Parameters:**

- `text: string`
- ```tsx
  options?: {
    chunkSize?: number;
    textField?: string; // Field name in which to save a chunk text
    embeddingField?: string; // Field name in which to save an embedding
  }
  ```

#### eleganceServerClient.ai.dataURLtoEmbeddings

Converts a DataURL (csv, pdf) into an embedding by splitting the text into chunks.

**Parameters:**

- `dataURL: string`
- ```tsx
  options?: {
    chunkSize?: number;
    textField?: string; // Field name in which to save a chunk text
    embeddingField?: string; // Field name in which to save an embedding
  }
  ```

**Returns:** `Array<{ text: string; embedding: Embedding }>`

#### eleganceServerClient.ai.createChatCompletion

Generates a chat completion.

**Parameters:**

- ```tsx
  body: {
    prompt?: string;
    promptEmbedding?: Embedding;
    model?: string;
    temperature?: number;
    searchResults?: ({ similarity: number } & Record<string, any>)[];
    messages?: Array<{role: string; content: string}>;
    maxTokens?: number;
    maxContextLength?: number;
    minSimilarity?: number;
  }
  ```

**Returns:** `string`

#### createEleganceClient

Creates an EleganceClient instance for a client.

**Parameters:**

- `connectionType: "kai" | "mysql"`
- ```tsx
  config: {
    baseURL: string; // Server URL with the '/elegance/:route' route handler.
  }
  ```

**Returns:** `eleganceServerClient`

#### eleganceClient

Client that includes requests and hooks. It is used to make requests to the server.

#### eleganceClient.requests

Clean functions to make requests to the server. They can be used anywhere within a project and are handled like typical async functions. The parameters for each request correspond to the controller parameters by name. To familiarize with the parameters, refer to the `eleganceServerClient.controllers.<requestName>.execute` section.

#### eleganceClient.hooks

Ready-to-use React.js hooks with state handlers that use requests. Each hook has the following type:

```tsx
<R = any,>(options?: { initialValue?: R; initialIsLoading?: boolean; onError?: (error: DefaultError) => void }) => {
  value: R | undefined;
  error: DefaultError | undefined;
  isLoading: boolean;
  setValue: react.Dispatch<react.SetStateAction<Awaited<R> | undefined>>;
  setError: react.Dispatch<react.SetStateAction<DefaultError | undefined>>;
  setIsLoading: react.Dispatch<react.SetStateAction<boolean>>;
  execute: (body: object) => Promise<Awaited<R> | undefined>; // Function that executes a request from the eleganceClient.requests by name
};
```

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)

© 2023 SingleStore
