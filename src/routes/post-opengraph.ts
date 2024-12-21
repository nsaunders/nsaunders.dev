import sharp from "sharp";
import { Readable } from "stream";
import { ReadableStream } from "stream/web";

import { getPostByName, getPostResourceURL } from "../data/post.ts";
import type { Route } from "./+types/post-opengraph.ts";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPostByName(params.name);

  const resizer = sharp().resize({ width: 1200, height: 630 }).png();

  const url = getPostResourceURL(post.name, post.image.src);
  const upstream = await fetch(url);

  if (!upstream.ok) {
    throw new Response(
      `Upstream request to ${url} failed with a status of ${upstream.status} (${upstream.statusText}).`,
      { status: 500 },
    );
  }

  if (!upstream.body) {
    throw new Response(`Upstream response from ${url} did not have a body.`);
  }

  Readable.fromWeb(
    upstream.body as Parameters<typeof Readable.fromWeb>[0],
  ).pipe(resizer);

  return new Response(ReadableStream.from(resizer), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
