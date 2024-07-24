import fs from "fs/promises";
import path from "path";
import url from "url";

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
        i === length - 1 ? `${x || "index"}.html` : x,
      ),
  );
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const res = await fetchWithRetry(10, `${process.env.HOST}${route}`);
  if (!res.ok) {
    throw new Error(
      `Unexpected ${res.status} response while fetching ${route}`,
    );
  }
  const html = await res.text();
  await fs.writeFile(outPath, html);
  console.log(`✅ Successfully rendered route ${route}.`);
}

(async function main() {
  await new Promise(resolve => setTimeout(() => resolve(undefined), 5000));
  console.log("Start generating routes.");
  await fs.rm(dist, { recursive: true, force: true });
  await Promise.all(["/", "/posts", "/about"].map(generate));
  console.log("\nAll routes have been generated successfully!");
  process.exit(0);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
