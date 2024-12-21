import sharp from "sharp";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";
import * as v from "valibot";

import * as Mime from "../data/mime.ts";
import * as Str from "../data/string.ts";
import type { Route } from "./+types/optimized.ts";

export async function loader({ params }: Route.LoaderArgs) {
  const IntParamSchema = v.pipe(
    v.string(),
    v.regex(/^[0-9]+$/),
    v.transform(parseInt),
  );

  const paramsParseResult = v.safeParse(
    v.pipe(
      v.object({
        width: IntParamSchema,
        height: IntParamSchema,
        "*": v.pipe(v.string(), v.nonEmpty()),
      }),
      v.transform(({ "*": pathname, ...rest }) => ({ ...rest, pathname })),
    ),
    params,
  );

  if (
    !paramsParseResult.success ||
    !Str.endsWith(paramsParseResult.output.pathname, Mime.knownExtensions)
  ) {
    throw new Response(null, { status: 404 });
  }

  const {
    output: { width, height, pathname },
  } = paramsParseResult;

  const mime = Mime.fromPath(pathname);

  if (!Str.startsWith(mime, "image/") || Str.endsWith(mime, "/svg+xml")) {
    throw new Response(null, { status: 404 });
  }

  const upstream = await fetch(
    `https://media.githubusercontent.com/media/nsaunders/writing/refs/heads/master/${pathname}`,
  );

  if (!upstream.ok || !upstream.body) {
    throw new Response(null, { status: 500 });
  }

  const resizer = sharp()
    .resize({ width, height, fit: "cover" })
    [Str.removePrefix(mime, "image/")]();

  Readable.fromWeb(
    upstream.body as Parameters<typeof Readable.fromWeb>[0],
  ).pipe(resizer);

  return new Response(ReadableStream.from(resizer), {
    status: 200,
    headers: {
      "Content-Type": mime,
    },
  });
}
