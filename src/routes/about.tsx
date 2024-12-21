import { prerenderToNodeStream } from "react-dom/static";
import { pipe } from "remeda";

import { Block } from "../components/block.tsx";
import { Markdown } from "../components/markdown.tsx";
import { darkMode, on } from "../css.ts";
import { createMetaDescriptors } from "../data/meta.ts";
import { getPageByName } from "../data/page.ts";
import { blue, gray } from "../design/colors.ts";
import type { Route } from "./+types/about.ts";

export async function loader() {
  const page = await getPageByName("about");

  const { prelude: stream } = await prerenderToNodeStream(
    <Markdown
      urlTransform={url => {
        return URL.parse(url, `x:/about/`)?.toString().replace(/^x:/, "");
      }}>
      {page.markdown}
    </Markdown>,
  );

  const html = await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
    stream.on("error", err => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

  return { ...page, html };
}

export const meta: Route.MetaFunction = createMetaDescriptors({
  title: "About",
  description:
    "Overview of my programming journey, technical background, and guiding principles",
});

export default function About({ loaderData: { html } }: Route.ComponentProps) {
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
