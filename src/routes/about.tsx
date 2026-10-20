import { Block } from "../components/block.tsx";
import { markdownComponents } from "../components/markdown.tsx";
import AboutContent from "../content/pages/about/index.mdx";
import { darkMode, mergeStyles, on } from "../css.ts";
import { createMetaDescriptors } from "../data/meta.ts";
import { blue, gray } from "../design/colors.ts";
import type { Route } from "./+types/about.ts";

export const meta: Route.MetaFunction = createMetaDescriptors({
  title: "About",
  description:
    "I'm Nick Saunders, a software engineer focused on React, TypeScript, and design systems. Read about my work, open-source projects, and approach to component design.",
});

export default function About() {
  return (
    <main>
      <header
        style={mergeStyles(
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
              style={mergeStyles(
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
        <div style={{ marginBlock: 32 }}>
          <AboutContent components={markdownComponents("/about/")} />
        </div>
      </Block>
    </main>
  );
}
