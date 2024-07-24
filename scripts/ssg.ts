import fs from "fs/promises";
import path from "path";
import url from "url";

const dist = path.resolve(
  url.fileURLToPath(import.meta.url),
  "..",
  "..",
  "dist",
);

async function generate(route: string) {
  const outPath = path.resolve(
    dist,
    ...route
      .split("/")
      .map((x, i, { length }) =>
        i === length - 1 ? `${x || "index"}.html` : x,
      ),
  );
  console.log(path.dirname(outPath), { recursive: true });
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  const res = await fetch(`${process.env.HOST}${route}`);
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
  await fs.rm(dist, { recursive: true });
  await Promise.all(["/", "/posts", "/about"].map(generate));
  console.log("\nAll routes have been generated successfully!");
  process.exit(0);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
