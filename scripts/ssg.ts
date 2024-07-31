import fs from "fs/promises";
import path from "path";
import url from "url";

import * as Posts from "../app/data/posts.js";
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
  const content = await res.blob();
  await fs.writeFile(outPath, content);
  console.log(`✅ Successfully rendered route ${route}.`);
}

(async function main() {
  init();

  const posts = await Posts.list();

  console.log("Start generating routes.");
  await fs.rm(dist, { recursive: true, force: true });
  await Promise.all(
    [
      "/",
      "/posts",
      "/projects",
      "/about",
      ...posts.map(({ name }) => `/posts/${name}`),
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
