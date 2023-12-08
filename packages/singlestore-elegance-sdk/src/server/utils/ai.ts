import OpenAI from "openai";
import type { CreateChatCompletionBody, Embedding, EmbeddingInput, AIConfig } from "../../shared/types";
import { csvStringToArray } from "./csv";
import { decodeDataURL } from "./dataURL";
import { pdfBufferToString } from "./pdf";
import { splitText } from "./helpers";

export type AI = ReturnType<typeof createAI>;

function createOpenAI(config?: AIConfig["openai"]) {
  if (!config?.apiKey) return undefined;
  return new OpenAI(config);
}

export function createAI<A extends AIConfig = AIConfig>(config?: A) {
  const openai = createOpenAI(config?.openai);

  function createEmbedding(input: EmbeddingInput) {
    if (config?.customizers?.createEmbedding) {
      return config.customizers.createEmbedding(input);
    }

    if (!openai) return [];

    let retries = 0;
    let _input = Array.isArray(input) ? input : [input];

    if (typeof _input[0] === "object") {
      _input = _input.map(i => JSON.stringify(i));
    }

    _input = _input.map(i => i.replace("\n", " "));

    async function create(): Promise<Embedding[]> {
      try {
        const response = await openai!.embeddings.create({ input: _input, model: "text-embedding-ada-002" });
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

  function embeddingToBuffer(embedding: Embedding) {
    const float32 = new Float32Array(embedding);
    return Buffer.from(new Uint8Array(float32.buffer));
  }

  async function createChatCompletion(body: CreateChatCompletionBody) {
    if (config?.customizers?.createChatCompletion) {
      return config.customizers.createChatCompletion(body);
    }

    if (!openai) return null;

    const response = await openai.chat.completions.create({
      model: body.model ?? "gpt-3.5-turbo",
      messages: [...(body.messages ?? [])],
      max_tokens: body.maxTokens,
      temperature: body.temperature
    });

    return response.choices[0]?.message.content;
  }

  return {
    openai,
    createEmbedding,
    textToEmbeddings,
    dataURLtoEmbeddings,
    embeddingToBuffer,
    createChatCompletion
  };
}
