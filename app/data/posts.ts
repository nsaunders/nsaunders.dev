import matter from "gray-matter";
import { z } from "zod";

import * as GH from "./github.js";

export async function list() {
  const res = await fetch(
    "https://api.github.com/repos/nsaunders/writing/contents/posts",
    GH.configureRequest({}),
  );
  if (!res.ok) {
    throw new Error("An error occurred while fetching the list of posts.");
  }
  const json = await res.json();
  return z
    .array(z.object({ name: z.string() }))
    .parse(json)
    .filter(({ name }) => !name.includes("."));
}

export async function listWithDetails() {
  const posts = await list();
  let postsWithDetails = await Promise.all(
    posts.map(({ name }) => getByName(name)),
  );
  if (process.env.NODE_ENV === "production") {
    const now = new Date();
    postsWithDetails = postsWithDetails.filter(
      ({ published }) => published < now,
    );
  }
  return postsWithDetails.sort((a, b) =>
    a.published < b.published ? 1 : a.published > b.published ? -1 : 0,
  );
}

export async function getByName(name: string) {
  const res = await fetch(
    `https://raw.githubusercontent.com/nsaunders/writing/master/posts/${name}/index.md`,
    GH.configureRequest({}),
  );
  if (!res.ok) {
    throw new Error(`Request for post "${name}" failed: ${res.statusText}`);
  }
  const { content: markdown, data } = matter(await res.text());
  return {
    name,
    markdown,
    discussionHref: `https://x.com/search?q=${encodeURIComponent(
      `https://nsaunders.dev/posts/${name}`,
    )}`,
    editHref: `https://github.com/nsaunders/writing/edit/master/posts/${name}/index.md`,
    ...z
      .object({
        title: z.string(),
        description: z.string(),
        image_src: z.string(),
        image_alt: z.string(),
        published: z.date(),
        tags: z.array(z.string()),
      })
      .transform(({ image_src, image_alt, ...rest }) => ({
        ...rest,
        image: {
          src: image_src,
          alt: image_alt,
        },
      }))
      .parse(data),
  };
}

export async function getLatest() {
  const [post] = await listWithDetails();
  return (post as typeof post | undefined) ? post : null;
}

export function listAssetsByName(name: string) {
  return go(
    `https://api.github.com/repos/nsaunders/writing/contents/posts/${name}/assets`,
  );
  async function go(url: string): Promise<string[]> {
    const res = await fetch(url, GH.configureRequest({}));
    return (
      await Promise.all(
        z
          .array(z.object({ path: z.string(), url: z.string().url() }))
          .parse(await res.json())
          .map(async content => {
            if (/\.[a-z0-9]+$/.test(content.path)) {
              return [`/${content.path}`];
            }
            return await go(content.url);
          }),
      )
    ).flat();
  }
}
