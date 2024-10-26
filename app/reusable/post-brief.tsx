import readingTime from "reading-time";
import { pipe } from "remeda";

import type * as Posts from "~/data/posts.js";

import { resolveURL } from "../data/resolve-url.js";
import { ClientOnly } from "./client-only.js";
import { gray } from "./colors.js";
import { darkMode, on } from "./css.js";
import { Link } from "./link.js";
import { TextLink } from "./text-link.js";

export function PostBrief(
  props: Pick<
    Exclude<Awaited<ReturnType<typeof Posts.getLatest>>, null>,
    "title" | "description" | "image" | "published" | "name" | "markdown"
  >,
) {
  const rt = Math.round(readingTime(props.markdown).minutes);
  return (
    <div style={{ containerType: "inline-size" }}>
      <div
        style={pipe(
          {
            display: "grid",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "repeat(4, auto)",
            gap: "8px 20px",
          },
          on("@container (min-width: 640px)", {
            gridTemplateColumns: "160px 1fr",
            gridTemplateRows: "auto auto 1fr",
          }),
        )}>
        <img
          src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
          alt={props.image.alt}
          style={pipe(
            {
              backgroundImage: `url(${resolveURL(
                `/optimized/640x360/posts/${props.name}/`,
                props.image.src,
              )})`,
              backgroundSize: "cover",
              width: "100%",
              aspectRatio: 16 / 9,
              marginBlock: 8,
            },
            on("@container (min-width: 640px)", {
              backgroundImage: `url(${resolveURL(
                `/optimized/160x160/posts/${props.name}/`,
                props.image.src,
              )})`,
              aspectRatio: 1,
              gridRow: "span 3",
              marginBlock: 0,
            }),
          )}
        />
        <h1
          style={pipe(
            {
              fontSize: 32,
              fontWeight: "normal",
              lineHeight: 1.25,
              order: -1,
              margin: 0,
            },
            on("@container (min-width: 640px)", {
              order: "revert-layer",
            }),
          )}>
          <TextLink as={Link} to={`/posts/${props.name}`}>
            {props.title}
          </TextLink>
        </h1>
        <p style={{ margin: 0 }}>{props.description}</p>
        <div
          style={pipe(
            {
              color: gray(60),
            },
            on(darkMode, {
              color: gray(40),
            }),
          )}>
          <ClientOnly>
            {props.published.toLocaleDateString(undefined, {
              dateStyle: "long",
            })}
          </ClientOnly>
          {" | "}
          {rt} minute{rt === 1 ? "" : "s"}
        </div>
      </div>
    </div>
  );
}
