import { getPostResourceURL } from "../data/post.ts";
import type { Route } from "./+types/post-asset.ts";

export function loader({ params }: Route.LoaderArgs) {
  const { name, "*": pathname } = params;
  return fetch(getPostResourceURL(name, pathname));
}
