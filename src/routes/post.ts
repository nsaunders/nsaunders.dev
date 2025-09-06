import type { ReactNode } from "react";
import { prerenderToNodeStream } from "react-dom/static";
import readingTime from "reading-time";
import { pipe } from "remeda";
import {
  _a,
  br$,
  button,
  circle,
  component,
  div,
  form,
  h1,
  header,
  hgroup,
  img,
  input,
  label,
  line,
  main$,
  p,
  path,
  polyline,
  rect,
  section,
  span,
  span$,
  svg,
} from "renuel";

import { Block$ } from "../components/block.ts";
import { ClientOnly$ } from "../components/client-only.ts";
import { Hr$ } from "../components/hr.ts";
import { Markdown } from "../components/markdown.ts";
import { ScreenReaderOnly$ } from "../components/screen-reader-only.ts";
import { TextLink$ } from "../components/text-link.ts";
import { darkMode, hover, on } from "../css.ts";
import { createMetaDescriptors } from "../data/meta.ts";
import { getPostByName } from "../data/post.ts";
import { blue, gray, red, white } from "../design/colors.ts";
import type { Route } from "./+types/post.ts";

export async function loader({ params: { name } }: Route.LoaderArgs) {
  const post = await getPostByName(name);

  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }

  const { prelude: stream } = await prerenderToNodeStream(
    Markdown(
      {
        urlTransform: url => {
          return URL.canParse(url, `x:/posts/${post.name}/`)
            ? new URL(url, `x:/posts/${post.name}/`)
                .toString()
                .replace(/^x:/, "")
            : undefined;
        },
      },
      post.markdown,
    ),
  );

  const html = await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
    stream.on("error", err => reject(err));
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });

  return {
    ...post,
    html,
  };
}

export const meta: Route.MetaFunction = createMetaDescriptors(
  ({ data: post, location: { pathname } }) => ({
    title: post.title,
    description: post.description,
    image: URL.canParse(
      "opengraph.png",
      `x:${pathname}${pathname.endsWith("/") ? "" : "/"}`,
    )
      ? new URL(
          "opengraph.png",
          `x:${pathname}${pathname.endsWith("/") ? "" : "/"}`,
        ).pathname
      : undefined,
  }),
);

const { LabelValuePair$ } = component(
  "LabelValuePair",
  ({ children }: { children?: ReactNode }) => {
    return div(
      { style: { display: "flex", gap: 4, alignItems: "center" } },
      children,
    );
  },
);

export default function Post({ loaderData: post }: Route.ComponentProps) {
  return main$(
    header(
      {
        style: pipe(
          {
            backgroundColor: gray(15),
            paddingBlock: 64,
          },
          on(darkMode, {
            backgroundColor: gray(85),
          }),
        ),
      },
      Block$(
        hgroup(
          {
            style: {
              display: "flex",
              flexDirection: "column",
              gap: 32,
            },
          },
          h1(
            {
              style: pipe(
                {
                  fontSize: 40,
                  fontWeight: "normal",
                  lineHeight: 1.3,
                  color: blue(80),
                  margin: 0,
                },
                on(darkMode, {
                  color: blue(20),
                }),
              ),
            },
            post.title,
          ),
          img({
            src: URL.canParse(
              post.image.src,
              `x:/optimized/960/540/posts/${post.name}/`,
            )
              ? new URL(
                  post.image.src,
                  `x:/optimized/960/540/posts/${post.name}/`,
                ).pathname
              : undefined,
            alt: post.image.alt,
            style: {
              aspectRatio: "16 / 9",
              objectFit: "cover",
            },
          }),
          p({ style: { margin: 0, fontSize: 24 } }, post.description),
          div(
            {
              style: pipe(
                {
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 16,
                  alignItems: "center",
                  color: gray(70),
                },
                on(darkMode, {
                  color: gray(30),
                }),
              ),
            },
            LabelValuePair$(
              svg(
                {
                  style: { width: 16, height: 16 },
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                },
                rect({ x: 3, y: 4, width: 18, height: 18, rx: 2, ry: 2 }),
                line({ x1: 16, y1: 2, x2: 16, y2: 6 }),
                line({ x1: 8, y1: 2, x2: 8, y2: 6 }),
                line({ x1: 3, y1: 10, x2: 21, y2: 10 }),
              ),
              span$(
                ClientOnly$(
                  new Date(post.published).toLocaleDateString(undefined, {
                    dateStyle: "long",
                  }),
                ),
              ),
            ),
            post.updated
              ? LabelValuePair$(
                  svg(
                    {
                      style: { width: 16, height: 16 },
                      viewBox: "0 0 24 24",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                    },
                    polyline({ points: "23 4 23 10 17 10" }),
                    polyline({ points: "1 20 1 14 7 14" }),
                    path({
                      d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
                    }),
                  ),
                  span$(
                    ClientOnly$(
                      new Date(post.updated).toLocaleDateString(undefined, {
                        dateStyle: "long",
                      }),
                    ),
                  ),
                )
              : undefined,
            LabelValuePair$(
              svg(
                {
                  width: 16,
                  height: 16,
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: "feather feather-clock",
                },
                circle({ cx: 12, cy: 12, r: 10 }),
                polyline({ points: "12 6 12 12 16 14" }),
              ),
              span$(readingTime(post.markdown).minutes.toFixed(0), " minutes"),
            ),
          ),
        ),
      ),
    ),
    Block$(
      div(
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingBlock: 32,
          },
        },
        div({ dangerouslySetInnerHTML: { __html: post.html } }),
        div(
          { style: { display: "flex", gap: 8, color: gray(50) } },
          TextLink$(_a({ href: post.discussionHref }, "Discuss this post")),
          span$(" | "),
          TextLink$(_a({ href: post.editHref }, "Suggest an edit")),
        ),
      ),
    ),
    Block$(
      Hr$(),
      div({ style: { height: 32 } }),
      Subscribe$(),
      div({ style: { height: 32 } }),
    ),
  );
}

const { Subscribe$ } = component("Subscribe", () => {
  return section(
    { style: { display: "flex", flexWrap: "wrap" } },
    div(
      {
        style: {
          containerType: "inline-size",
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "calc((60ch - 100%) * 999)",
          display: "grid",
        },
      },
      div(
        {
          style: pipe(
            {
              backgroundColor: white,
              color: gray(80),
              padding: 32,
              boxShadow: `inset 0 0 0 1px ${gray(20)}`,
            },
            on(darkMode, {
              boxShadow: "none",
            }),
            on("@container (width >= 400px)", {
              padding: 48,
            }),
          ),
        },
        h1(
          {
            style: {
              margin: 0,
              fontSize: 32,
              fontWeight: 700,
              lineHeight: 1.25,
            },
          },
          "Stay informed",
        ),
        p(
          {
            style: {
              margin: 0,
              fontSize: 24,
              lineHeight: 4 / 3,
              marginBlock: 16,
            },
          },
          "Subscribe to email updates and be the first to know when I post new content.",
        ),
        p(
          { style: { lineHeight: 1.25, color: gray(60) } },
          "I hate spam as much as you do.",
          br$(),
          "Unsubscribe at any time — no hard feelings!",
        ),
      ),
    ),
    div(
      {
        style: {
          containerType: "inline-size",
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "calc((60ch - 100%) * 999)",
          display: "grid",
        },
      },
      form(
        {
          style: pipe(
            {
              backgroundColor: gray(80),
              color: white,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              padding: 32,
              gap: 32,
            },
            on("@container (width >= 400px)", {
              padding: 48,
            }),
          ),
          method: "POST",
          action:
            "https://dev.us21.list-manage.com/subscribe/post?u=1961e884a06fdad7a53bc160e&id=3f29e7fcdf&f_id=00905ce1f0",
        },
        (
          [
            ["Email", "email", "EMAIL", true],
            ["First name", "text", "FNAME", false],
          ] as const
        ).map(([labelText, inputType, name, required]) =>
          label(
            {
              key: labelText,
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 8,
              },
            },
            span({ style: { lineHeight: 1 } }, labelText),
            input({
              type: inputType,
              name,
              required,
              style: pipe(
                {
                  font: "inherit",
                  lineHeight: "inherit",
                  backgroundColor: gray(5),
                  color: gray(90),
                  padding: 8,
                  borderWidth: 0,
                  borderRadius: 4,
                  outlineWidth: 0,
                  outlineStyle: "solid",
                  outlineColor: blue(50),
                  outlineOffset: 2,
                },
                on("&:focus-visible", {
                  outlineWidth: 2,
                }),
              ),
            }),
          ),
        ),
        ScreenReaderOnly$(
          input({
            "data-desc": "thwart-bots",
            type: "text",
            name: "b_1961e884a06fdad7a53bc160e_3f29e7fcdf",
            tabIndex: -1,
          }),
        ),
        button(
          {
            type: "submit",
            style: pipe(
              {
                alignSelf: "center",
                font: "inherit",
                lineHeight: "inherit",
                paddingBlock: 8,
                paddingInline: 12,
                borderWidth: 0,
                borderRadius: 4,
                backgroundColor: blue(50),
                color: white,
                outlineWidth: 0,
                outlineStyle: "solid",
                outlineColor: blue(50),
                outlineOffset: 2,
              },
              on("&:focus-visible", {
                outlineWidth: 2,
              }),
              on(hover, {
                backgroundColor: blue(40),
              }),
              on("&:active", {
                backgroundColor: red(40),
              }),
            ),
          },
          "Subscribe",
        ),
      ),
    ),
  );
});
