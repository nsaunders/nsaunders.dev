import { omit, pick, pipe } from "remeda";
import { div, h1, header, hgroup, main, p } from "renuel";

import { Block, Block$ } from "../components/block.ts";
import { Card$ } from "../components/card.ts";
import { Hr } from "../components/hr.ts";
import { _Link } from "../components/link.ts";
import { PostBrief } from "../components/post-brief.ts";
import { Project } from "../components/project.ts";
import { TextLink$ } from "../components/text-link.ts";
import { darkMode, on } from "../css.ts";
import { getLatestPost } from "../data/post.ts";
import { getFeaturedProject } from "../data/project.ts";
import { black, gray, white } from "../design/colors.ts";
import type { Route } from "./+types/home.ts";

export async function loader() {
  return {
    latestPost: await getLatestPost(),
    featuredProject: await getFeaturedProject(),
  };
}

export default function Home({
  loaderData: { latestPost, featuredProject },
}: Route.ComponentProps) {
  return main(
    {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: 32,
        marginBottom: 32,
      },
    },
    header(
      {
        style: {
          backgroundColor: black,
          color: white,
          paddingTop: 32,
          paddingBottom: 64,
        },
      },
      Block$(
        hgroup(
          { style: { display: "flex", flexDirection: "column", gap: 16 } },
          h1(
            {
              style: {
                fontSize: 48,
                fontWeight: "normal",
                margin: 0,
              },
            },
            "Hi there, I'm Nick.",
          ),
          p(
            { style: { margin: 0, fontSize: 24 } },
            "I'm an experienced software engineer focused on React, TypeScript, user experience, and design systems. I also dabble in functional programming.",
          ),
        ),
      ),
    ),
    [
      latestPost
        ? [
            div(
              {
                key: "latest-post",
                style: {
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                },
              },
              h1(
                { style: { fontSize: 24, fontWeight: "normal", margin: 0 } },
                "Latest post",
              ),
              Card$(
                PostBrief({
                  ...pipe(
                    latestPost,
                    pick(["name", "title", "description", "image", "markdown"]),
                  ),
                  published: new Date(latestPost.published),
                }),
              ),
              TextLink$(_Link({ to: "/posts" }, "View more")),
            ),
          ]
        : [],
      featuredProject
        ? [
            div(
              {
                key: "featured-project",
                style: { display: "flex", flexDirection: "column", gap: 16 },
              },
              h1(
                { style: { fontSize: 24, fontWeight: "normal", margin: 0 } },
                "Featured project",
              ),
              div(
                { style: { containerType: "inline-size" } },
                Card$(
                  div(
                    {
                      style: pipe(
                        {
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          gap: 32,
                        },
                        on("@container (min-width: 640px)", {
                          gridTemplateColumns: "1fr 1fr",
                        }),
                      ),
                    },
                    div(
                      {
                        style: pipe(
                          {
                            padding: 32,
                            backgroundColor: gray(12),
                          },
                          on(darkMode, {
                            backgroundColor: gray(80),
                          }),
                        ),
                      },
                      Project(pipe(featuredProject, omit(["story"]))),
                    ),
                    p({ style: { margin: 0 } }, featuredProject.story),
                  ),
                ),
              ),
              TextLink$(_Link({ to: "/projects" }, "View more")),
            ),
          ]
        : [],
    ]
      .flatMap((x, i) => (i ? [Hr({ key: i }), x] : [x]))
      .map((x, i) => Block({ key: i }, x)),
  );
}
