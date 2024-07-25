import dotenv from "dotenv";

import { validate } from "../app/data/env.js";

export function init() {
  dotenv.config(); // TODO: Drop dotenv after Cloudflare upgrades to Node v20.6.
  validate();
}
