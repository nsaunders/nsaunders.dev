import { readFile } from "node:fs/promises";

import * as Mime from "../data/mime.ts";
import { getPostResourcePath } from "../data/post.ts";
import * as Str from "../data/string.ts";
import type { Route } from "./+types/post-asset.ts";

export async function loader({ params }: Route.LoaderArgs) {
  const { name, "*": pathname } = params;
  if (!Str.endsWith(pathname, Mime.knownExtensions)) {
    throw new Response(null, { status: 404 });
  }
  return new Response(
    new Uint8Array(await readFile(getPostResourcePath(name, pathname))),
    { headers: { "Content-Type": Mime.fromPath(pathname) } },
  );
}
