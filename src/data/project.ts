import * as cheerio from "cheerio";
import * as v from "valibot";

import { githubRequestInit } from "./github.ts";

const username = "nsaunders";

const ProjectSchema = v.object({
  url: v.string(),
  owner: v.string(),
  name: v.string(),
  description: v.string(),
  language: v.object({ name: v.string(), color: v.string() }),
  stars: v.pipe(v.number(), v.integer()),
  forks: v.pipe(v.number(), v.integer()),
});

export async function listProjects() {
  const res = await fetch(
    `https://github.com/${username}`,
    githubRequestInit(),
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
      return v.parse(ProjectSchema, {
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

export async function getFeaturedProject() {
  const projects = await listProjects();
  const stories = await listStories();
  const project = projects.find(p =>
    stories.some(s => p.owner === s.owner && p.name === s.name),
  );
  if (project) {
    const res = await fetch(
      `https://raw.githubusercontent.com/nsaunders/writing/master/projects/${project.owner}/${project.name}.md`,
      githubRequestInit(),
    );
    if (!res.ok) {
      throw new Error(
        `An error occurred while fetching the story for ${project.owner}/${project.name}: ${res.statusText}`,
      );
    }
    const story = await res.text();
    return { ...project, story };
  }
  return null;
}

async function listStories() {
  const res = await fetch(
    `https://api.github.com/repos/${username}/writing/git/trees/master?recursive=true`,
    githubRequestInit(),
  );
  const json = await res.json();

  const { tree } = v.parse(
    v.object({ tree: v.array(v.object({ path: v.string() })) }),
    json,
  );

  return v.parse(
    v.array(v.object({ name: v.string(), owner: v.string() })),
    tree
      .map(({ path }) => (path.match(/^projects\/(.+)\.md$/) || [])[1])
      .filter(Boolean)
      .map(x => {
        const [owner, name] = x.split("/");
        return { owner, name };
      }),
  );
}

export async function getProjectStatsByOwnerAndName(
  owner: string,
  name: string,
) {
  // Note: Do not use `githubRequestInit()` as this request happens on the client.
  const res = await fetch(`https://api.github.com/repos/${owner}/${name}`);
  if (!res.ok) {
    throw new Error(
      `Unable to fetch GitHub repository details for ${owner}/${name}: ${res.statusText}`,
    );
  }
  const json = await res.json();
  const { forks_count: forks, stargazers_count: stars } = v.parse(
    v.object({
      forks_count: v.pipe(v.number(), v.integer()),
      stargazers_count: v.pipe(v.number(), v.integer()),
    }),
    json,
  );
  return { forks, stars };
}
