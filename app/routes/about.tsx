import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import Markdown from "react-markdown";

import { createMeta } from "~/data/meta.js";
import * as Pages from "~/data/pages.js";
import { Block } from "~/reusable/block.js";
import { Box } from "~/reusable/box.js";
import { blue, gray } from "~/reusable/colors.js";
import { highlighter } from "~/reusable/highlighter.js";
import { markdownComponents } from "~/reusable/markdown-components.js";

export async function loader() {
  const page = await Pages.getByName("about");
  const highlighterInstance = await highlighter();
  const res = json({
    ...page,
    html: renderToString(
      <Markdown
        components={markdownComponents({
          highlighter: highlighterInstance,
          basePath: `/about/`,
        })}>
        {page.markdown}
      </Markdown>,
    ),
  });
  highlighterInstance.dispose();
  return res;
}

export const meta = createMeta(() => ({
  title: "About",
  description:
    "Overview of my programming journey, technical background, and guiding principles",
}));

export default function About() {
  const { html } = useLoaderData<typeof loader>();
  return (
    <main>
      <Box
        as="header"
        backgroundColor={gray(15)}
        dark:backgroundColor={gray(85)}
        paddingBlock={64}>
        <Block>
          <Box
            as="hgroup"
            display="flex"
            alignItems="center"
            justifyContent="space-between">
            <Box
              as="h1"
              fontSize={40}
              fontWeight="normal"
              lineHeight={1.25}
              color={blue(80)}
              dark:color={blue(20)}>
              About
            </Box>
            <Box
              as="img"
              src="https://github.com/nsaunders.png"
              alt="Nick Saunders"
              borderRadius={999}
              width={128}
              height={128}
            />
          </Box>
        </Block>
      </Box>
      <Block>
        <Box marginBlock={32} dangerouslySetInnerHTML={{ __html: html }} />
      </Block>
    </main>
  );
}
