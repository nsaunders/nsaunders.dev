import { z } from "zod";

const schema = z.object({
  VITE_GITHUB_ACCESS_TOKEN: z.string().min(1),
});

export type Env = z.infer<typeof schema>;

export function validate() {
  schema.parse(import.meta.env);
}
