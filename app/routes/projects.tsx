import { useLoaderData } from "@remix-run/react";

import * as Projects from "~/data/projects.js";
import { Block } from "~/reusable/block.js";
import { Box } from "~/reusable/box.js";
import { Card } from "~/reusable/card.js";
import { Project } from "~/reusable/project.js";

export function loader() {
  return Projects.list();
}

export default function Page() {
  const projects = useLoaderData<typeof loader>();
  return (
    <main>
      <Block>
        <h1>Projects</h1>
        <Box
          is="ul"
          listStyleType="none"
          padding={0}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          gap={32}>
          {projects.map(project => (
            <Box
              is="li"
              key={`${project.owner}/${project.name}`}
              display="grid">
              <Card>
                <Project {...project} />
              </Card>
            </Box>
          ))}
        </Box>
      </Block>
    </main>
  );
}
