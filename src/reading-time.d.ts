declare module "reading-time/lib/reading-time.js" {
  import type { Options, ReadTimeResults } from "reading-time";

  export default function readingTime(
    text: string,
    options?: Options,
  ): ReadTimeResults;
}
