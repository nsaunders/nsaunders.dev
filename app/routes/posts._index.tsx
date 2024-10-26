import { useLoaderData } from "@remix-run/react";
import { pipe } from "remeda";

import { createMeta } from "~/data/meta.js";
import * as Posts from "~/data/posts.js";
import { Block } from "~/reusable/block.js";
import { Card } from "~/reusable/card.js";
import { gray } from "~/reusable/colors.js";
import { darkMode, on } from "~/reusable/css.js";
import { PostBrief } from "~/reusable/post-brief.js";

export function loader() {
  return Posts.listWithDetails();
}

export const meta = createMeta(() => ({
  title: "Posts",
  description:
    "My thoughts on React, TypeScript, frontend development, and software engineering in general",
}));

export default function Page() {
  const [latestPost, ...posts] = useLoaderData<typeof loader>();
  return (
    <Block>
      <main style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: 32,
          }}>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: "normal" }}>
            Latest post
          </h1>
          {latestPost ? (
            <Card>
              <PostBrief
                {...latestPost}
                published={new Date(latestPost.published)}
              />
            </Card>
          ) : undefined}
        </section>
        <hr
          style={pipe(
            {
              margin: 0,
              height: 1,
              borderWidth: 0,
              backgroundColor: gray(20),
            },
            on(darkMode, {
              backgroundColor: gray(80),
            }),
          )}
        />
        <section style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: "normal", margin: 0 }}>
            Worth a read
          </h1>
          <ul
            style={{
              listStyleType: "none",
              margin: 0,
              padding: 0,
              display: "contents",
            }}>
            {posts.map(post => (
              <Card key={post.name} importance="secondary">
                <li>
                  <PostBrief {...post} published={new Date(post.published)} />
                </li>
              </Card>
            ))}
          </ul>
        </section>
      </main>
    </Block>
  );
}
