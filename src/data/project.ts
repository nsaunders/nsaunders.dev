import * as cheerio from "cheerio";
import * as v from "valibot";

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
  const res = await fetch(`https://github.com/${username}`);
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

export async function getProjectStatsByOwnerAndName(
  owner: string,
  name: string,
) {
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
