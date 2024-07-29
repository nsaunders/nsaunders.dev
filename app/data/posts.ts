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
        published: z.date(),
        tags: z.array(z.string()),
      })
      .parse(data),
  };
}

export async function getLatest() {
  const [post] = await listWithDetails();
  return (post as typeof post | undefined) ? post : null;
}
