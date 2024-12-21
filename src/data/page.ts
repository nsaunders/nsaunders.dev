import { githubRequestInit } from "./github.ts";

export async function getPageByName(name: string) {
  const res = await fetch(
    `https://raw.githubusercontent.com/nsaunders/writing/master/pages/${name}/index.md`,
    githubRequestInit(),
  );
  if (!res.ok) {
    throw new Error(
      `An error occurred while fetching page "${name}": ${res.statusText}`,
    );
  }
  return { name, markdown: await res.text() };
}
