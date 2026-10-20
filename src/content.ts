import type { MDXComponents } from "mdx/types";
import type { ComponentType } from "react";

type ContentComponent = ComponentType<{ components?: MDXComponents }>;

const posts = import.meta.glob<{ default: ContentComponent }>(
  "./content/posts/*/index.mdx",
  { eager: true },
);

export function getPostContent(name: string) {
  const post = posts[`./content/posts/${name}/index.mdx`];
  if (!post) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }
  return post.default;
}
