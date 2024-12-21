import { pipe } from "remeda";

import { Block } from "../components/block.tsx";
import { Card } from "../components/card.tsx";
import { Project } from "../components/project.tsx";
import { on } from "../css.ts";
import { createMetaDescriptors } from "../data/meta.ts";
import { listProjects } from "../data/project.ts";
import type { Route } from "./+types/projects.ts";

export function loader() {
  return listProjects();
}

export const meta: Route.MetaFunction = createMetaDescriptors({
  title: "Projects",
  description:
    "Overview of my programming projects and open-source contributions",
});

export default function Projects({
  loaderData: projects,
}: Route.ComponentProps) {
  return (
    <div style={{ marginBlock: 32 }}>
      <Block>
        <h1 style={{ fontSize: 24, fontWeight: "normal", margin: 0 }}>
          Projects
        </h1>
        <div style={{ containerType: "inline-size" }}>
          <ul
            style={pipe(
              {
                listStyleType: "none",
                marginTop: 16,
                padding: 0,
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 32,
              },
              on("@container (min-width: 640px)", {
                gridTemplateColumns: "repeat(2, 1fr)",
              }),
            )}>
            {projects.map(project => (
              <li
                key={`${project.owner}/${project.name}`}
                style={{ display: "grid" }}>
                <Card>
                  <Project {...project} />
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Block>
    </div>
  );
}
