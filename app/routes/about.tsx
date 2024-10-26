import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import Markdown from "react-markdown";
import { pipe } from "remeda";

import { createMeta } from "~/data/meta.js";
import * as Pages from "~/data/pages.js";
import { Block } from "~/reusable/block.js";
import { blue, gray } from "~/reusable/colors.js";
import { darkMode, on } from "~/reusable/css.js";
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
      <header
        style={pipe(
          {
            backgroundColor: gray(15),
            paddingBlock: 64,
          },
          on(darkMode, {
            backgroundColor: gray(85),
          }),
        )}>
        <Block>
          <hgroup
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <h1
              style={pipe(
                {
                  margin: 0,
                  fontSize: 40,
                  fontWeight: "normal",
                  lineHeight: 1.25,
                  color: blue(80),
                },
                on(darkMode, {
                  color: blue(20),
                }),
              )}>
              About
            </h1>
            <img
              src="https://github.com/nsaunders.png"
              alt="Nick Saunders"
              style={{
                width: 128,
                height: 128,
                borderRadius: 999,
              }}
            />
          </hgroup>
        </Block>
      </header>
      <Block>
        <div
          style={{ marginBlock: 32 }}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Block>
    </main>
  );
}
