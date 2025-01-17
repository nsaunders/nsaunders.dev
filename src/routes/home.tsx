import { Link } from "react-router";
import { pipe } from "remeda";

import { Block } from "../components/block.tsx";
import { Card } from "../components/card.tsx";
import { Hr } from "../components/hr.tsx";
import { PostBrief } from "../components/post-brief.tsx";
import { Project } from "../components/project.tsx";
import { TextLink } from "../components/text-link.tsx";
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
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
        marginBottom: 32,
      }}>
      <header
        style={{
          backgroundColor: black,
          color: white,
          paddingTop: 32,
          paddingBottom: 64,
        }}>
        <Block>
          <hgroup style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h1
              style={{
                fontSize: 48,
                fontWeight: "normal",
                margin: 0,
              }}>
              Hi there, I&apos;m Nick.
            </h1>
            <p style={{ margin: 0, fontSize: 24 }}>
              I&apos;m an experienced software engineer focused on React,
              TypeScript, user experience, and design systems. I also dabble in
              functional programming.
            </p>
          </hgroup>
        </Block>
      </header>
      {[
        latestPost
          ? [
              <div
                key="latest-post"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}>
                <h1
                  style={{
                    fontSize: 24,
                    fontWeight: "normal",
                    margin: 0,
                  }}>
                  Latest post
                </h1>
                <Card>
                  <PostBrief
                    {...latestPost}
                    published={new Date(latestPost.published)}
                  />
                </Card>
                <TextLink as={Link} to="/posts">
                  View more
                </TextLink>
              </div>,
            ]
          : [],
        featuredProject
          ? [
              <div
                key="featured-project"
                style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h1 style={{ fontSize: 24, fontWeight: "normal", margin: 0 }}>
                  Featured project
                </h1>
                <div style={{ containerType: "inline-size" }}>
                  <Card>
                    <div
                      style={pipe(
                        {
                          display: "grid",
                          gridTemplateColumns: "1fr",
                          gap: 32,
                        },
                        on("@container (min-width: 640px)", {
                          gridTemplateColumns: "1fr 1fr",
                        }),
                      )}>
                      <div
                        style={pipe(
                          {
                            padding: 32,
                            backgroundColor: gray(12),
                          },
                          on(darkMode, {
                            backgroundColor: gray(80),
                          }),
                        )}>
                        <Project {...featuredProject} />
                      </div>
                      <p style={{ margin: 0 }}>{featuredProject.story}</p>
                    </div>
                  </Card>
                </div>
                <TextLink as={Link} to="/projects">
                  View more
                </TextLink>
              </div>,
            ]
          : [],
      ]
        .flatMap((x, i) => (i ? [<Hr key={i} />, x] : [x]))
        .map((x, i) => (
          <Block key={i}>{x}</Block>
        ))}
    </main>
  );
}
