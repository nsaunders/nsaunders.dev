import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import * as v from "valibot";

const postsDirectory = path.resolve("src/content/posts");

export async function listPosts() {
  return (await readdir(postsDirectory, { withFileTypes: true }))
    .filter(entry => entry.isDirectory())
    .map(({ name }) => ({ name }));
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
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Response(null, { status: 404 });
  }
  const { content: markdown, data } = matter(
    await readFile(path.join(postsDirectory, name, "index.mdx"), "utf8"),
  );
  return {
    name,
    markdown,
    discussionHref: `https://x.com/search?q=${encodeURIComponent(
      `https://nsaunders.dev/posts/${name}`,
    )}`,
    editHref: `https://github.com/nsaunders/nsaunders.dev/edit/${process.env.APP_URL === "https://next.nsaunders.dev" ? "next" : "latest"}/src/content/posts/${name}/index.mdx`,
    ...v.parse(
      v.pipe(
        v.object({
          title: v.string(),
          description: v.string(),
          image_src: v.string(),
          image_alt: v.string(),
          published: v.date(),
          updated: v.optional(v.date()),
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

export function getPostResourcePath(name: string, pathname: string) {
  if (!/^[a-z0-9-]+$/.test(name)) {
    throw new Response(null, { status: 404 });
  }
  const directory = path.join(postsDirectory, name);
  const resourcePath = path.resolve(directory, pathname);
  if (!resourcePath.startsWith(`${directory}${path.sep}`)) {
    throw new Response(null, { status: 404 });
  }
  return resourcePath;
}

export async function listPostAssetsByName(name: string) {
  const directory = path.join(postsDirectory, name, "assets");
  return walk(directory);

  async function walk(currentDirectory: string): Promise<string[]> {
    return (
      await Promise.all(
        (await readdir(currentDirectory, { withFileTypes: true })).map(
          entry => {
            const entryPath = path.join(currentDirectory, entry.name);
            return entry.isDirectory()
              ? walk(entryPath)
              : path.relative(path.join(postsDirectory, name), entryPath);
          },
        ),
      )
    ).flat();
  }
}
