import { pick, pipe } from "remeda";
import { h1, hr, li$, main, section, ul } from "renuel";

import { Block$ } from "../components/block.ts";
import { Card, Card$ } from "../components/card.ts";
import { PostBrief } from "../components/post-brief.ts";
import { darkMode, on } from "../css.ts";
import { createMetaDescriptors } from "../data/meta.ts";
import { listPostsWithDetails } from "../data/post.ts";
import { gray } from "../design/colors.ts";
import type { Route } from "./+types/posts.ts";

export function loader() {
  return listPostsWithDetails();
}

export const meta: Route.MetaFunction = createMetaDescriptors({
  title: "Posts",
  description:
    "My thoughts on React, TypeScript, frontend development, and software engineering in general",
});

export default function Posts({
  loaderData: [latestPost, ...posts],
}: Route.ComponentProps) {
  return Block$(
    main(
      { style: { display: "flex", flexDirection: "column", gap: 32 } },
      section(
        {
          style: {
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 32,
          },
        },
        h1(
          { style: { margin: 0, fontSize: 24, fontWeight: "normal" } },
          "Latest post",
        ),
        latestPost
          ? Card$(
              PostBrief({
                ...pipe(
                  latestPost,
                  pick(["description", "image", "markdown", "name", "title"]),
                ),
                published: new Date(latestPost.published),
              }),
            )
          : undefined,
      ),
      hr({
        style: pipe(
          {
            margin: 0,
            height: 1,
            borderWidth: 0,
            backgroundColor: gray(20),
          },
          on(darkMode, {
            backgroundColor: gray(80),
          }),
        ),
      }),
      section(
        { style: { display: "flex", flexDirection: "column", gap: 32 } },
        h1(
          { style: { fontSize: 24, fontWeight: "normal", margin: 0 } },
          "Still worth a read",
        ),
        ul(
          {
            style: {
              listStyleType: "none",
              margin: 0,
              padding: 0,
              display: "contents",
            },
          },
          posts.map(post =>
            Card(
              { key: post.name, importance: "secondary" },
              li$(
                PostBrief({
                  ...pipe(
                    post,
                    pick(["description", "image", "markdown", "name", "title"]),
                  ),
                  published: new Date(post.published),
                }),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
