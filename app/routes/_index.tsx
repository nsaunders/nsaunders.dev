import type { MetaFunction } from "@remix-run/react";
import { json, useLoaderData } from "@remix-run/react";

import * as Posts from "~/data/posts.js";
import { Box } from "~/reusable/box.js";
import { Card } from "~/reusable/card.js";

import { PostBrief } from "../reusable/post-brief.js";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export async function loader() {
  return json(await Posts.getLatest());
}

export default function Index() {
  const latestPost = useLoaderData<typeof loader>();
  return (
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
  );
}
