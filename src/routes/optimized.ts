import { readFile } from "node:fs/promises";

import sharp from "sharp";
import * as v from "valibot";

import * as Mime from "../data/mime.ts";
import { getPostResourcePath } from "../data/post.ts";
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

  const [, name, ...resourceParts] = pathname.split("/");
  if (!name || resourceParts.length === 0) {
    throw new Response(null, { status: 404 });
  }
  const image = await sharp(
    await readFile(getPostResourcePath(name, resourceParts.join("/"))),
  )
    .resize({ width, height, fit: "cover" })
    [Str.removePrefix(mime, "image/")]()
    .toBuffer();

  return new Response(new Uint8Array(image), {
    status: 200,
    headers: {
      "Content-Type": mime,
    },
  });
}
