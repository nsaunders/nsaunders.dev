import readingTime from "reading-time";

import type * as Posts from "~/data/posts.js";

import { Box } from "./box.js";
import { ClientOnly } from "./client-only.js";
import { gray } from "./colors.js";
import { Link } from "./link.js";
import { resolveURL } from "./resolve-url.js";
import { TextLink } from "./text-link.js";

export function PostBrief(
  props: Pick<
    Exclude<Awaited<ReturnType<typeof Posts.getLatest>>, null>,
    "title" | "description" | "image" | "published" | "name" | "markdown"
  >,
) {
  const rt = Math.round(readingTime(props.markdown).minutes);
  return (
    <Box containerType="inline-size">
      <Box
        display="grid"
        gridTemplateColumns="1fr"
        gridTemplateRows="repeat(4, auto)"
        containerLarge:gridTemplateColumns="160px 1fr"
        containerLarge:gridTemplateRows="auto auto 1fr"
        gap="8px 20px">
        <Box
          is="img"
          src={resolveURL(`/posts/${props.name}/`, props.image)}
          alt="Photo"
          containerLarge:gridRow="span 3"
          width="100%"
          aspectRatio={16 / 9}
          containerLarge:aspectRatio={1}
          objectFit="cover"
          marginBlock={8}
          containerLarge:marginBlock={0}
        />
        <Box
          is="h1"
          fontSize={32}
          fontWeight="normal"
          lineHeight={1.25}
          order={-1}
          containerLarge:order="revert-layer">
          <TextLink is={Link} to={`/posts/${props.name}`}>
            {props.title}
          </TextLink>
        </Box>
        <Box is="p">{props.description}</Box>
        <Box color={gray[60]} dark:color={gray[40]}>
          <ClientOnly>
            {props.published.toLocaleDateString(undefined, {
              dateStyle: "long",
            })}
          </ClientOnly>
          {" | "}
          {rt} minute{rt === 1 ? "" : "s"}
        </Box>
      </Box>
    </Box>
  );
}
