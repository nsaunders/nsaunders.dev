import { json, useLoaderData } from "@remix-run/react";

import * as Posts from "~/data/posts.js";
import * as Projects from "~/data/projects.js";
import { Block } from "~/reusable/block.js";
import { Box } from "~/reusable/box.js";
import { Card } from "~/reusable/card.js";
import { black, gray, white } from "~/reusable/colors.js";
import { Hr } from "~/reusable/hr.js";
import { Link } from "~/reusable/link.js";
import { Project } from "~/reusable/project.js";
import { TextLink } from "~/reusable/text-link.js";

import { PostBrief } from "../reusable/post-brief.js";

export async function loader() {
  return json({
    latestPost: await Posts.getLatest(),
    featuredProject: await Projects.getFeatured(),
  });
}

export default function Index() {
  const { latestPost, featuredProject } = useLoaderData<typeof loader>();
  return (
    <Box
      is="main"
      display="flex"
      flexDirection="column"
      gap={32}
      marginBottom={32}>
      <Box
        is="header"
        backgroundColor={black}
        color={white}
        paddingTop={32}
        paddingBottom={64}>
        <Block>
          <Box is="hgroup" display="flex" flexDirection="column" gap={16}>
            <Box is="h1" fontSize={48} fontWeight="normal">
              Hi there, I&apos;m Nick.
            </Box>
            <Box is="p" fontSize={24}>
              I&apos;m an experienced software engineer focused on React,
              TypeScript, user experience, and design systems. I also dabble in
              functional programming.
            </Box>
          </Box>
        </Block>
      </Box>
      {[
        latestPost
          ? [
              <Box
                key="latest-post"
                display="flex"
                flexDirection="column"
                gap={16}>
                <Box is="h1" fontSize={24} fontWeight="normal">
                  Latest post
                </Box>
                <Card>
                  <PostBrief
                    {...latestPost}
                    published={new Date(latestPost.published)}
                  />
                </Card>
                <TextLink is={Link} to="/posts">
                  View more
                </TextLink>
              </Box>,
            ]
          : [],
        featuredProject
          ? [
              <Box
                key="featured-project"
                display="flex"
                flexDirection="column"
                gap={16}>
                <Box is="h1" fontSize={24} fontWeight="normal">
                  Featured project
                </Box>
                <Box containerType="inline-size">
                  <Card>
                    <Box
                      display="grid"
                      gridTemplateColumns="1fr"
                      containerLarge:gridTemplateColumns="1fr 1fr"
                      gap={32}>
                      <Box
                        is="div"
                        padding={32}
                        backgroundColor={gray[12]}
                        dark:backgroundColor={gray[80]}>
                        <Project {...featuredProject} />
                      </Box>
                      <Box is="p">{featuredProject.story}</Box>
                    </Box>
                  </Card>
                </Box>
                <TextLink is={Link} to="/projects">
                  View more
                </TextLink>
              </Box>,
            ]
          : [],
      ]
        .flatMap((x, i) => (i ? [<Hr key={i} />, x] : [x]))
        .map((x, i) => (
          <Block key={i}>{x}</Block>
        ))}
    </Box>
  );
}
