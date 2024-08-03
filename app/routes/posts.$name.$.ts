import type { LoaderFunctionArgs } from "@remix-run/node";
import sharp from "sharp";

import * as Posts from "~/data/posts.js";
import { resolveURL } from "~/data/resolve-url.js";

export async function loader({ params, request: { url } }: LoaderFunctionArgs) {
  if (!params["*"] || !params["*"].endsWith("opengraph.png")) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const { protocol, host } = new URL(url);

  let post: Awaited<ReturnType<typeof Posts.getByName>>;
  if (!params.name || !(post = await Posts.getByName(params.name))) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const imageRes = await fetch(
    `${protocol}//${host}${resolveURL(`/posts/${post.name}/`, post.image.src)}`,
  );
  if (!imageRes.ok) {
    throw new Response(
      `Unexpected ${imageRes.status} ${imageRes.statusText} response while getting post image.`,
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
  return new Response(
    await sharp(await imageRes.arrayBuffer())
      .resize({ width: 1200, height: 630, fit: "cover" })
      .png()
      .toBuffer(),
    {
      headers: {
        "Content-Type": "image/png",
      },
    },
  );
}
