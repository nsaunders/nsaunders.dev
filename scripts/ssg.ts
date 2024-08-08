import fs from "fs/promises";
import path from "path";
import url from "url";

import * as Posts from "../app/data/posts.js";
import { resolveURL } from "../app/data/resolve-url.js";
import { init } from "./_init.js";

const dist = path.resolve(
  url.fileURLToPath(import.meta.url),
  "..",
  "..",
  "dist",
);

async function fetchWithRetry(r: number, ...args: Parameters<typeof fetch>) {
  if (!r) {
    return await fetch(...args);
  }
  try {
    return await fetch(...args);
  } catch {
    await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
    return await fetchWithRetry(r - 1, ...args);
  }
}

async function generate(route: string) {
  const outPath = path.resolve(
    dist,
    ...route
      .split("/")
      .map((x, i, { length }) =>
        i === length - 1 && !/\.[a-z0-9]+$/.test(x)
          ? `${x || "index"}.html`
          : x,
      ),
  );
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const res = await fetchWithRetry(10, `${process.env.HOST}${route}`);
  if (!res.ok) {
    throw new Error(
      `Unexpected ${res.status} response while fetching ${route}`,
    );
  }
  if (!res.body) {
    throw new Error(`No response body for route ${route}`);
  }
  await fs.writeFile(outPath, res.body);
  console.log(`✅ Successfully rendered route ${route}.`);
}

(async function main() {
  init();

  const posts = await Posts.listWithDetails();

  console.log("Start generating routes.");
  await fs.rm(dist, { recursive: true, force: true });
  await Promise.all(
    [
      "/",
      "/about",
      "/posts",
      "/projects",
      "/rss.xml",
      ...posts.flatMap(({ name, image: { src: image } }) => [
        `/posts/${name}`,
        `/posts/${name}/opengraph.png`,
        ...["160x160", "640x360", "960x540"].map(dim =>
          resolveURL(`/optimized/${dim}/posts/${name}/`, image),
        ),
      ]),
      ...(
        await Promise.all(posts.map(({ name }) => Posts.listAssetsByName(name)))
      ).flat(),
    ].map(generate),
  );
  console.log("\nAll routes have been generated successfully!");
  process.exit(0);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
