import _OpenAI from "openai";
import { csvStringToArray } from "./csv";
import { decodeDataURL } from "./dataURL";
import { pdfBufferToString } from "./pdf";
import { splitText } from "./helpers";
import { CreateChatCompletionBody, OpenAIConfig, OpenAIRequestOptions } from "../../shared/types";

export type OpenAI = ReturnType<typeof createOpenAI>;

export function createOpenAI(config?: OpenAIConfig) {
  if (!config) return undefined;

  const openai = new _OpenAI(config);

  function createEmbedding(input: string | object | string[] | object[]) {
    let retries = 0;
    let _input = Array.isArray(input) ? input : [input];

    if (typeof _input[0] === "object") {
      _input = _input.map(i => JSON.stringify(i));
    }

    _input = _input.map(i => i.replace("\n", " "));

    async function create(): Promise<number[][]> {
      try {
        const response = await openai.embeddings.create({ input: _input, model: "text-embedding-ada-002" });
        retries = 0;
        return response.data.map(({ embedding }) => embedding);
      } catch (error) {
        if (retries < 5) {
          console.error("An error occurred while creating the embedding. Retrying...");
          retries += 1;
          return create();
        } else {
          throw error;
        }
      }
    }

    return create();
  }

  function embeddingToBuffer(embedding: number[]) {
    const float32 = new Float32Array(embedding);
    return Buffer.from(new Uint8Array(float32.buffer));
  }

  async function textToEmbeddings(
    text: string,
    options: { chunkSize?: number; textField?: string; embeddingField?: string } = {}
  ) {
    const { chunkSize = 1000, textField = "text", embeddingField = "embedding" } = options;
    const source = splitText(text, chunkSize);
    const embeddings = await createEmbedding(source);
    const embeddingsWithText = embeddings.map((embedding, i) => ({
      [textField]: source[i],
      [embeddingField]: embedding
    }));

    return embeddingsWithText;
  }

  async function dataURLtoEmbeddings(
    dataURL: string,
    options: { chunkSize?: number; textField?: string; embeddingField?: string } = {}
  ) {
    const { chunkSize = 1000, textField = "text", embeddingField = "embedding" } = options;
    let source: string[] = [];
    const { type, buffer } = decodeDataURL(dataURL);

    if (type === "csv") {
      source = await csvStringToArray(buffer.toString("utf-8"));
    } else {
      source = splitText(await pdfBufferToString(buffer), chunkSize);
    }

    const embeddings = await createEmbedding(source);

    const embeddingsWithText = embeddings.map((embedding, i) => ({
      [textField]: source[i],
      [embeddingField]: embedding
    }));

    return embeddingsWithText;
  }

  async function createChatCompletion(body: CreateChatCompletionBody, options?: OpenAIRequestOptions) {
    const response = await openai.chat.completions.create(
      {
        ...options,
        model: body.model ?? "gpt-3.5-turbo",
        messages: [...(body.messages ?? [])]
      },
      options
    );

    return response.choices[0]?.message.content;
  }

  return Object.assign(openai, {
    helpers: { createEmbedding, embeddingToBuffer, textToEmbeddings, dataURLtoEmbeddings, createChatCompletion }
  });
}
