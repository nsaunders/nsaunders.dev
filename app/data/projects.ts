import * as cheerio from "cheerio";
import { z } from "zod";

import * as GH from "./github.js";

const username = "nsaunders";

const projectSchema = z.object({
  url: z.string(),
  owner: z.string(),
  name: z.string(),
  description: z.string(),
  language: z.object({ name: z.string(), color: z.string() }),
  stars: z.number(),
  forks: z.number(),
});

export async function list() {
  const res = await fetch(
    `https://github.com/${username}`,
    GH.configureRequest({}),
  );
  const $ = cheerio.load(await res.text());
  return $(".pinned-item-list-item-content")
    .map(function () {
      const owner: string =
        $(this).find("a .owner").text().trim().replace(/\/$/, "") || username;
      const name: string = $(this).find("a .repo").text().trim();
      const description: string = $(this)
        .find(".pinned-item-desc")
        .text()
        .trim();
      const languageColor: unknown =
        $(this).find(".repo-language-color").css("background-color") || "black";
      const languageName: unknown = $(this)
        .find("[itemProp='programmingLanguage']")
        .text()
        .trim();
      const stars =
        parseInt($(this).find("a[href$='stargazers']").text().trim()) || 0;
      const forks =
        parseInt($(this).find("a[href$='forks']").text().trim()) || 0;
      return projectSchema.parse({
        url: `https://github.com/${owner}/${name}`,
        owner,
        name,
        description,
        language: { name: languageName, color: languageColor },
        stars,
        forks,
      });
    })
    .toArray();
}

export async function getFeatured() {
  const projects = await list();
  const stories = await listStories();
  const project = projects.find(p =>
    stories.some(s => p.owner === s.owner && p.name === s.name),
  );
  if (project) {
    const res = await fetch(
      `https://raw.githubusercontent.com/nsaunders/writing/master/projects/${project.owner}/${project.name}.md`,
      GH.configureRequest({}),
    );
    if (!res.ok) {
      throw new Error(
        `An error occurred while fetching the story for ${project.owner}/${project.name}: ${res.statusText}`,
      );
    }
    const story = await res.text();
    return { ...project, story };
  }
}

async function listStories() {
  const res = await fetch(
    `https://api.github.com/repos/${username}/writing/git/trees/master?recursive=true`,
    GH.configureRequest({}),
  );
  const json = await res.json();

  const { tree } = z
    .object({ tree: z.array(z.object({ path: z.string() })) })
    .parse(json);

  return z.array(z.object({ name: z.string(), owner: z.string() })).parse(
    tree
      .map(({ path }) => (path.match(/^projects\/(.+)\.md$/) || [])[1])
      .filter(x => x)
      .map(x => {
        const [owner, name] = x.split("/");
        return { owner, name };
      }),
  );
}

export async function getStatsByOwnerAndName(owner: string, name: string) {
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`);
  if (!res.ok) {
    throw new Error(
      `Unable to fetch GitHub repository details for ${owner}/${name}: ${res.statusText}`,
    );
  }
  const json = await res.json();
  const { forks_count: forks, stargazers_count: stars } = z
    .object({ forks_count: z.number(), stargazers_count: z.number() })
    .parse(json);
  return { forks, stars };
}
