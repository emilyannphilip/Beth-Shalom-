import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/**"]),
  js.configs.recommended,
  {
    files: ["test/**/*.cjs"],
    languageOptions: {
      globals: {
        AbortSignal: "readonly",
        require: "readonly",
        __dirname: "readonly",
        process: "readonly",
        fetch: "readonly",
        URL: "readonly",
      },
    },
  },
  {
    files: ["src/**/*.ts"],
    extends: tseslint.configs.recommended,
  },
]);
