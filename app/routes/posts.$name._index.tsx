import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import Markdown from "react-markdown";
import readingTime from "reading-time";
import { pipe } from "remeda";

import { createMeta } from "~/data/meta.js";
import * as Posts from "~/data/posts.js";
import { Block } from "~/reusable/block.js";
import { ClientOnly } from "~/reusable/client-only.js";
import { blue, gray, red, white } from "~/reusable/colors.js";
import { darkMode, hover, on } from "~/reusable/css.js";
import { highlighter } from "~/reusable/highlighter.js";
import { Hr } from "~/reusable/hr.js";
import { markdownComponents } from "~/reusable/markdown-components.js";
import { ScreenReaderOnly } from "~/reusable/screen-reader-only.js";
import { TextLink } from "~/reusable/text-link.js";

import { resolveURL } from "../data/resolve-url.js";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = params.name ? await Posts.getByName(params.name) : undefined;
  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  const highlighterInstance = await highlighter();
  const res = json({
    ...post,
    html: renderToString(
      <Markdown
        components={markdownComponents({
          highlighter: highlighterInstance,
          basePath: `/posts/${post.name}/`,
        })}>
        {post.markdown}
      </Markdown>,
    ),
  });
  highlighterInstance.dispose();
  return res;
}

export const meta = createMeta<typeof loader>(post => ({
  title: post.title,
  description: post.description,
  image: `/posts/${post.name}/opengraph.png`,
  url: `/posts/${post.name}`,
}));

function LabelValuePair({ children }: { children?: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {children}
    </div>
  );
}

export default function Page() {
  const post = useLoaderData<typeof loader>();
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
              flexDirection: "column",
              gap: 32,
            }}>
            <h1
              style={pipe(
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
              )}>
              {post.title}
            </h1>
            <img
              src={resolveURL(
                `/optimized/960x540/posts/${post.name}/`,
                post.image.src,
              )}
              alt={post.image.alt}
              style={{
                aspectRatio: "16 / 9",
                objectFit: "cover",
              }}
            />
            <p style={{ margin: 0, fontSize: 24 }}>{post.description}</p>
            <div
              style={pipe(
                {
                  display: "flex",
                  gap: 16,
                  alignItems: "center",
                  color: gray(70),
                },
                on(darkMode, {
                  color: gray(30),
                }),
              )}>
              <LabelValuePair>
                <svg
                  style={{ width: 16, height: 16 }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                <span>
                  <ClientOnly>
                    {new Date(post.published).toLocaleDateString(undefined, {
                      dateStyle: "long",
                    })}
                  </ClientOnly>
                </span>
              </LabelValuePair>
              <LabelValuePair>
                <svg
                  width={16}
                  height={16}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="feather feather-clock">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>
                  {readingTime(post.markdown).minutes.toFixed(0)} minutes
                </span>
              </LabelValuePair>
            </div>
          </hgroup>
        </Block>
      </header>
      <Block>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            paddingBlock: 32,
          }}>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
          <div style={{ display: "flex", gap: 8, color: gray(50) }}>
            <TextLink href={post.discussionHref}>Discuss this post</TextLink>
            <span>|</span>
            <TextLink href={post.editHref}>Suggest an edit</TextLink>
          </div>
        </div>
      </Block>
      <Block>
        <Hr />
        <div style={{ height: 32 }} />
        <Subscribe />
        <div style={{ height: 32 }} />
      </Block>
    </main>
  );
}

function Subscribe() {
  return (
    <section style={{ display: "flex", flexWrap: "wrap" }}>
      <div
        style={pipe(
          {
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: "calc((60ch - 100%) * 999)",
            backgroundColor: white,
            color: gray(80),
            padding: 48,
            boxShadow: `inset 0 0 0 1px ${gray(20)}`,
          },
          on(darkMode, {
            boxShadow: "none",
          }),
        )}>
        <h1
          style={{
            margin: 0,
            fontSize: 32,
            fontWeight: 700,
            lineHeight: 1.25,
          }}>
          Stay informed
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 24,
            lineHeight: 4 / 3,
            marginBlock: 16,
          }}>
          Subscribe to email updates and be the first to know when I post new
          content.
        </p>
        <p style={{ lineHeight: 1.25, color: gray(60) }}>
          I hate spam as much as you do.
          <br />
          Unsubscribe at any time — no hard feelings!
        </p>
      </div>
      <form
        style={{
          backgroundColor: gray(80),
          color: white,
          flexDirection: "column",
          alignItems: "stretch",
          padding: 48,
          gap: 32,
          display: "flex",
          flexGrow: 1,
          flexShrink: 1,
          flexBasis: "calc((60ch - 100%) * 999)",
        }}
        method="POST"
        action="https://dev.us21.list-manage.com/subscribe/post?u=1961e884a06fdad7a53bc160e&id=3f29e7fcdf&f_id=00905ce1f0">
        {(
          [
            ["Email", "email", "EMAIL", true],
            ["First name", "text", "FNAME", false],
          ] as const
        ).map(([label, inputType, name, required]) => (
          <label
            key={label}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}>
            <span style={{ lineHeight: 1 }}>{label}</span>
            <input
              type={inputType}
              name={name}
              required={required}
              style={pipe(
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
              )}
            />
          </label>
        ))}
        <ScreenReaderOnly>
          <input
            data-desc="thwart-bots"
            type="text"
            name="b_1961e884a06fdad7a53bc160e_3f29e7fcdf"
            tabIndex={-1}
          />
        </ScreenReaderOnly>
        <button
          type="submit"
          style={pipe(
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
          )}>
          Subscribe
        </button>
      </form>
    </section>
  );
}
