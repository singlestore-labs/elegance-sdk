import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["./src/client/index.ts"],
    outDir: "./dist",
    format: ["cjs", "esm"],
    external: ["react"],
    dts: true,
    clean: true,
    splitting: true,
    treeshake: true
  },
  {
    entry: ["./src/server/index.ts"],
    outDir: "./server/dist",
    format: ["cjs", "esm"],
    external: ["mongodb", "mysql2", "openai", "csv-parser", "pdf-parse"],
    dts: true,
    clean: true,
    splitting: true,
    treeshake: true
  },
  {
    entry: ["./src/shared/types/index.ts"],
    outDir: "./types/dist",
    format: ["cjs", "esm"],
    external: ["mongodb", "mysql2", "openai"],
    dts: true,
    clean: true
  }
]);
