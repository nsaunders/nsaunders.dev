import sharp from "sharp";

import { getPostByName, getPostResourcePath } from "../data/post.ts";
import type { Route } from "./+types/post-opengraph.ts";

export async function loader({ params }: Route.LoaderArgs) {
  const post = await getPostByName(params.name);

  const image = await sharp(getPostResourcePath(post.name, post.image.src))
    .resize({ width: 1200, height: 630 })
    .png()
    .toBuffer();

  return new Response(new Uint8Array(image), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
