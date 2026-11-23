import { fileURLToPath } from "node:url";

const config = {
  plugins: {
    [fileURLToPath(new URL("./scripts/public-tailwind.cjs", import.meta.url))]: {},
    "@tailwindcss/postcss": {},
  },
};

export default config;
