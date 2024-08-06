import type { MetaDescriptor } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { og } from "~/data/og.js";
import * as Projects from "~/data/projects.js";
import { Block } from "~/reusable/block.js";
import { Box } from "~/reusable/box.js";
import { Card } from "~/reusable/card.js";
import { Project } from "~/reusable/project.js";

export function loader() {
  return Projects.list();
}

export const meta: MetaDescriptor[] = [
  { title: "Projects" },
  {
    name: "description",
    content:
      "Overview of my programming projects and open-source contributions",
  },
  ...og({ url: "/projects" }),
];

export default function Page() {
  const projects = useLoaderData<typeof loader>();
  return (
    <Box marginBlock={32}>
      <Block>
        <Box is="h1" fontSize={24} fontWeight="normal">
          Projects
        </Box>
        <Box containerType="inline-size">
          <Box
            is="ul"
            listStyleType="none"
            marginTop={16}
            padding={0}
            display="grid"
            gridTemplateColumns="1fr"
            containerLarge:gridTemplateColumns="repeat(2, 1fr)"
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
        </Box>
      </Block>
    </Box>
  );
}
