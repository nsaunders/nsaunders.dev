import matter from "gray-matter";
import * as v from "valibot";

import { githubRequestInit } from "./github.ts";

export async function listPosts() {
  const res = await fetch(
    "https://api.github.com/repos/nsaunders/writing/contents/posts",
    githubRequestInit(),
  );
  if (!res.ok) {
    throw new Error("An error occurred while fetching the list of posts.");
  }
  return v.parse(
    v.pipe(
      v.array(v.object({ name: v.string() })),
      v.transform(posts => posts.filter(({ name }) => !name.includes("."))),
    ),
    await res.json(),
  );
}

export async function listPostsWithDetails() {
  const posts = await listPosts();
  let postsWithDetails = await Promise.all(
    posts.map(({ name }) => getPostByName(name)),
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

export async function getPostByName(name: string) {
  const res = await fetch(
    `https://raw.githubusercontent.com/nsaunders/writing/master/posts/${name}/index.md`,
    githubRequestInit(),
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
    ...v.parse(
      v.pipe(
        v.object({
          title: v.string(),
          description: v.string(),
          image_src: v.string(),
          image_alt: v.string(),
          published: v.date(),
          tags: v.array(v.string()),
        }),
        v.transform(({ image_src, image_alt, ...rest }) => ({
          ...rest,
          image: {
            src: image_src,
            alt: image_alt,
          },
        })),
      ),
      data,
    ),
  };
}

export const getLatestPost = () =>
  listPostsWithDetails().then(([latest]) => latest || null);

export const getPostResourceURL = (name: string, pathname: string) => {
  const baseURL = /\.(gif|jpe?g|png|webp)$/.test(pathname)
    ? "https://media.githubusercontent.com/media"
    : "https://raw.githubusercontent.com";
  return (
    URL.parse(
      pathname,
      `${baseURL}/nsaunders/writing/refs/heads/master/posts/${name}/`,
    )?.toString() || ""
  );
};

export function listPostAssetsByName(name: string) {
  return go(
    `https://api.github.com/repos/nsaunders/writing/contents/posts/${name}/assets`,
  );
  async function go(url: string): Promise<string[]> {
    const res = await fetch(url, githubRequestInit());
    return (
      await Promise.all(
        v
          .parse(
            v.array(
              v.object({ path: v.string(), url: v.pipe(v.string(), v.url()) }),
            ),
            await res.json(),
          )
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
