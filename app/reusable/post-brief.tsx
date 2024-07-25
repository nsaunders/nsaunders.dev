import { Link } from "@remix-run/react";
import readingTime from "reading-time";

import type * as Posts from "~/data/posts.js";

import { Box } from "./box.js";
import { ClientOnly } from "./client-only.js";
import { gray } from "./colors.js";
import { TextLink } from "./text-link.js";

export function PostBrief(
  props: Pick<
    Exclude<Awaited<ReturnType<typeof Posts.getLatest>>, null>,
    "title" | "description" | "published" | "name" | "markdown"
  >,
) {
  const rt = Math.round(readingTime(props.markdown).minutes);
  return (
    <Box display="flex" flexDirection="column">
      <Box color={gray[60]} dark:color={gray[40]}>
        <ClientOnly>
          {props.published.toLocaleDateString(undefined, { dateStyle: "long" })}
        </ClientOnly>
        {" | "}
        {rt} minute{rt === 1 ? "" : "s"}
      </Box>
      <Box is="h1" fontSize={32} fontWeight="normal">
        <TextLink is={Link} to={`/posts/${props.name}`}>
          {props.title}
        </TextLink>
      </Box>
      <Box is="p">{props.description}</Box>
    </Box>
  );
}
