import type { Env } from "./data/env.js";

declare global {
  interface ImportMetaEnv extends Env {}
}
