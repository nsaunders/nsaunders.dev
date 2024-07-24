import dns from "dns";
import fs from "fs/promises";
import path from "path";
import url from "url";

dns.setDefaultResultOrder("ipv4first");

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
