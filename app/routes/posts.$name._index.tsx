import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import type { ReactNode } from "react";
import { renderToString } from "react-dom/server";
import Markdown from "react-markdown";
import readingTime from "reading-time";

import * as Posts from "~/data/posts.js";
import { Block } from "~/reusable/block.js";
import { Box } from "~/reusable/box.js";
import { ClientOnly } from "~/reusable/client-only.js";
import { blue, gray } from "~/reusable/colors.js";
import { highlighter } from "~/reusable/highlighter.js";
import { markdownComponents } from "~/reusable/markdown-components.js";

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

function LabelValuePair({ children }: { children?: ReactNode }) {
  return (
    <Box display="flex" gap={4} alignItems="center">
      {children}
    </Box>
  );
}

export default function Post() {
  const post = useLoaderData<typeof loader>();
  return (
    <main>
      <Box
        is="header"
        backgroundColor={gray[15]}
        dark:backgroundColor={gray[85]}
        paddingBlock={64}>
        <Block>
          <Box is="hgroup" display="flex" flexDirection="column" gap={16}>
            <Box
              is="h1"
              fontSize={40}
              fontWeight="normal"
              lineHeight={1.25}
              color={blue[80]}
              dark:color={blue[20]}>
              {post.title}
            </Box>
            <Box is="p" fontSize={24}>
              {post.description}
            </Box>
            <Box
              display="flex"
              gap={16}
              alignItems="center"
              color={gray[70]}
              dark:color={gray[30]}>
              <LabelValuePair>
                <svg
                  style={{ width: "1em", height: "1em" }}
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
                  width="1em"
                  height="1em"
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
            </Box>
          </Box>
        </Block>
      </Box>
      <Box paddingBlock={32}>
        <Block>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </Block>
      </Box>
    </main>
  );
}
