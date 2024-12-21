/* eslint unused-imports/no-unused-vars:0 */
/* eslint @typescript-eslint/no-empty-object-type:0 */

import "@total-typescript/ts-reset";

import type * as v from "valibot";

import type * as Env from "./env.ts";

global {
  namespace NodeJS {
    interface ProcessEnv extends v.InferInput<typeof Env.Schema> {}
  }
}
