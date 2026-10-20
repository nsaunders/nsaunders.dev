import * as v from "valibot";

export const Schema = v.object({
  NODE_ENV: v.union([v.literal("development"), v.literal("production")]),
  APP_URL: v.pipe(
    v.string(),
    v.nonEmpty(),
    v.url(),
    v.custom(
      value => typeof value !== "string" || !value.endsWith("/"),
      "URL should not end with a '/'.",
    ),
  ),
});

export const parse = (env: unknown) => v.parse(Schema, env);
