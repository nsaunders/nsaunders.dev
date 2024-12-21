import "dotenv/config";

import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";

import * as Env from "./env.ts";

const env = Env.parse(process.env);

export default defineConfig({
  define: Object.fromEntries(
    Object.entries(env).map(([name, value]) => [
      `process.env.${name}`,
      JSON.stringify(value),
    ]),
  ),
  plugins: [reactRouter()],
});
