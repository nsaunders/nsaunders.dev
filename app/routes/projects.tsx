import { useLoaderData } from "@remix-run/react";
import { pipe } from "remeda";

import { createMeta } from "~/data/meta.js";
import * as Projects from "~/data/projects.js";
import { Block } from "~/reusable/block.js";
import { Card } from "~/reusable/card.js";
import { on } from "~/reusable/css.js";
import { Project } from "~/reusable/project.js";

export function loader() {
  return Projects.list();
}

export const meta = createMeta(() => ({
  title: "Projects",
  description:
    "Overview of my programming projects and open-source contributions",
}));

export default function Page() {
  const projects = useLoaderData<typeof loader>();
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
