import { useLoaderData } from "@remix-run/react";

import { createMeta } from "~/data/meta.js";
import * as Posts from "~/data/posts.js";
import { Block } from "~/reusable/block.js";
import { Box } from "~/reusable/box.js";
import { Card } from "~/reusable/card.js";
import { gray } from "~/reusable/colors.js";
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
      <Box as="main" display="flex" flexDirection="column" gap={32}>
        <Box
          as="section"
          display="flex"
          flexDirection="column"
          gap={16}
          marginTop={32}>
          <Box as="h1" fontSize={24} fontWeight="normal">
            Latest post
          </Box>
          {latestPost ? (
            <Card>
              <PostBrief
                {...latestPost}
                published={new Date(latestPost.published)}
              />
            </Card>
          ) : undefined}
        </Box>
        <Box
          as="hr"
          height={1}
          borderWidth={0}
          backgroundColor={gray(20)}
          dark:backgroundColor={gray(80)}
        />
        <Box as="section" display="flex" flexDirection="column" gap={32}>
          <Box as="h1" fontSize={24} fontWeight="normal">
            Worth a read
          </Box>
          <Box as="ul" listStyleType="none" padding={0} display="contents">
            {posts.map(post => (
              <Card key={post.name} importance="secondary">
                <Box as="li">
                  <PostBrief {...post} published={new Date(post.published)} />
                </Box>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
    </Block>
  );
}
