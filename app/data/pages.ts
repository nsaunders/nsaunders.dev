import * as GH from "./github.js";

export async function getByName(name: string) {
  const res = await fetch(
    `https://raw.githubusercontent.com/nsaunders/writing/master/pages/${name}/index.md`,
    GH.configureRequest({}),
  );
  if (!res.ok) {
    throw new Error(
      `An error occurred while fetching page "${name}": ${res.statusText}`,
    );
  }
  return { name, markdown: await res.text() };
}
