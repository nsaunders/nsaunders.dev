import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { listProjects } from "./project.ts";

const projectsDirectory = path.resolve("src/content/projects");

export async function getFeaturedProject() {
  const projects = await listProjects();
  const stories = await listStories();
  const project = projects.find(p =>
    stories.some(s => p.owner === s.owner && p.name === s.name),
  );
  if (!project) {
    return null;
  }
  const story = await readFile(
    path.join(projectsDirectory, project.owner, `${project.name}.md`),
    "utf8",
  );
  return { ...project, story };
}

async function listStories() {
  return (
    await Promise.all(
      (await readdir(projectsDirectory, { withFileTypes: true }))
        .filter(entry => entry.isDirectory())
        .map(async ({ name: owner }) =>
          (await readdir(path.join(projectsDirectory, owner)))
            .filter(name => name.endsWith(".md"))
            .map(name => ({ owner, name: name.replace(/\.md$/, "") })),
        ),
    )
  ).flat();
}
