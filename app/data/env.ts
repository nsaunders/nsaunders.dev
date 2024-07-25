import { z } from "zod";

const schema = z.object({
  VITE_GITHUB_ACCESS_TOKEN: z.string().optional(),
});

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof schema> {}
  }
  /* eslint-enable @typescript-eslint/no-namespace */
}

export function validate() {
  schema.parse(process.env);
}
