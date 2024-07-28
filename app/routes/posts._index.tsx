import { useLoaderData } from "@remix-run/react";

import * as Posts from "~/data/posts.js";
import { Block } from "~/reusable/block.js";
import { Box } from "~/reusable/box.js";
import { Card } from "~/reusable/card.js";
import { gray } from "~/reusable/colors.js";
import { PostBrief } from "~/reusable/post-brief.js";

export function loader() {
  return Posts.listWithDetails();
}
export default function Page() {
  const [latestPost, ...posts] = useLoaderData<typeof loader>();
  return (
    <Block>
      <Box is="main" display="flex" flexDirection="column" gap={32}>
        <Box
          is="section"
          display="flex"
          flexDirection="column"
          gap={16}
          marginTop={32}>
          <Box is="h1" fontSize={24} fontWeight="normal">
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
          is="hr"
          height={1}
          borderWidth={0}
          backgroundColor={gray[20]}
          dark:backgroundColor={gray[80]}
        />
        <Box is="section" display="flex" flexDirection="column" gap={32}>
          <Box is="h1" fontSize={24} fontWeight="normal">
            Still worth a read
          </Box>
          <Box is="ul" listStyleType="none" padding={0} display="contents">
            {posts.map(post => (
              <Box key={post.name} is="li">
                <PostBrief {...post} published={new Date(post.published)} />
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Block>
  );
}
