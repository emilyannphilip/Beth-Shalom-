import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist/**"]),
  js.configs.recommended,
  {
    files: ["src/**/*.ts"],
    extends: tseslint.configs.recommended,
  },
]);
