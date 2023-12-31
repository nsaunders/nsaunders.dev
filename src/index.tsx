import {
  Console,
  Effect,
  Either,
  Match,
  Option,
  ReadonlyArray,
  flow,
  pipe,
} from "effect";
import createHttpError from "http-errors";
import { css as hooksCSS } from "./css-hooks";

import { Asset, createAsset } from "./data/Asset";
import * as DateService from "./data/Date";
import * as HTML from "./data/HTML";
import * as Markdown from "./data/Markdown";
import * as Page from "./data/Page";
import * as Post from "./data/Post";
import * as Project from "./data/Project";
import * as Theme from "./data/Theme";
import { toXML } from "jstoxml";

import AboutPage from "./components/AboutPage";
import HomePage from "./components/HomePage";
import Icon from "./components/Icon";
import * as IconMeta from "./components/Icon";
import PostsPage from "./components/PostsPage";
import PostPage from "./components/PostPage";
import ProjectsPage from "./components/ProjectsPage";
import PostOpengraphImage from "./components/PostOpengraphImage";
import * as PostOpengraphImageMeta from "./components/PostOpengraphImage";
import ThemeSwitcher from "./components/ThemeSwitcher";

const htmlDoctype = "<!DOCTYPE html>";

export default {
  fetch(
    request: Request,
    env: { __STATIC_CONTENT: unknown },
    ctx: ExecutionContext,
  ) {
    const handler = Effect.gen(function* (_) {
      const pathname = yield* _(
        Effect.try({
          try: () => new URL(request.url).pathname,
          catch: () =>
            createHttpError(400, `Invalid request URL ${request.url}`),
        }),
      );

      if (pathname === "/rss.xml") {
        return yield* _(
          Post.list(),
          Effect.mapError(error =>
            createHttpError(500, "Failed fetching the list of posts.", {
              cause: Post.printListError(error),
            }),
          ),
          Effect.flatMap(posts =>
            Effect.try({
              try: () => {
                return toXML(
                  {
                    _name: "rss",
                    _attrs: {
                      version: "2.0",
                      "xmlns:dc": "http://purl.org/dc/elements/1.1/",
                      "xmlns:content":
                        "http://purl.org/rss/1.0/modules/content/",
                      "xmlns:atom": "http://www.w3.org/2005/Atom",
                    },
                    _content: {
                      channel: [
                        [
                          {
                            title: "Blog — nsaunders.dev",
                            description:
                              "Nick Saunders technical blog, focused on React, TypeScript, and frontend development",
                            link: "https://nsaunders.dev",
                            image: {
                              url: "https://github.com/nsaunders.png",
                              title: "nsaunders.dev",
                              link: "https://nsaunders.dev",
                            },
                            lastBuildDate: DateService.formatRFC822(new Date()),
                            "atom:link": {
                              _attrs: {
                                href: "https://nsaunders.dev/rss.xml",
                                rel: "self",
                                type: "application/rss+xml",
                              },
                            },
                          },
                        ],
                        ...posts.map(
                          ({ title, description, name, published }) => ({
                            item: [
                              {
                                title,
                                description,
                                link: `https://nsaunders.dev/posts/${name}`,
                                pubDate: DateService.formatRFC822(published),
                              },
                              {
                                _name: "guid",
                                _attrs: {
                                  isPermaLink: "true",
                                },
                                _content: `https://nsaunders.dev/posts/${name}`,
                              },
                            ],
                          }),
                        ),
                      ],
                    },
                  },
                  { header: true, indent: "  " },
                );
              },
              catch: error =>
                createHttpError(
                  500,
                  "The XML library generated an error unexpectedly.",
                  {
                    cause:
                      error instanceof Error ? error.message : "Unknown cause",
                  },
                ),
            }),
          ),
          Effect.map(
            content =>
              new Response(content, {
                headers: { "Content-Type": "text/xml" },
              }),
          ),
        );
      }

      const faviconMatch = Array.from(
        pathname.match(
          /\/(apple-touch-icon|(favicon|android-chrome)-([0-9]+)x([0-9]+))\.png$/,
        ) || [],
      )
        .slice(3)
        .map(x => parseInt(x) || 180);
      if (faviconMatch.length === 2) {
        const [width, height] = faviconMatch as [number, number];
        return yield* _(
          HTML.renderImage(<Icon width={width} height={height} />, {
            ...IconMeta,
            width,
            height,
          }),
          Effect.mapBoth({
            onFailure: error =>
              createHttpError(
                500,
                "An error occurred while rendering the image.",
                { inner: HTML.printRenderImageError(error) },
              ),
            onSuccess: content =>
              new Response(content, {
                headers: { "Content-Type": "image/png" },
              }),
          }),
        );
      }

      if (pathname === "/theme") {
        if (!/^post$/i.test(request.method)) {
          yield* _(
            Effect.fail(
              createHttpError(
                405,
                "Only the POST method is supported under the /themes path.",
              ),
            ),
          );
        }

        const formData = yield* _(
          Effect.tryPromise({
            try: () => request.formData(),
            catch: () =>
              createHttpError(400, "Unable to parse request body as form data"),
          }),
        );

        if (!formData.has("theme")) {
          yield* _(
            Effect.fail(
              createHttpError(
                400,
                'Form data do not include the required "theme" key.',
              ),
            ),
          );
        }

        const theme = yield* _(
          Theme.parse(formData.get("theme")),
          Effect.mapError(inner =>
            createHttpError(400, `Invalid theme "${formData.get("theme")}"`, {
              inner,
            }),
          ),
        );

        return new Response(HTML.render(<ThemeSwitcher theme={theme} />), {
          headers: {
            "Content-Type": "text/html",
            "Set-Cookie": `theme=${theme}; Max-Age: ${/*1 year*/ 31558464}`,
          },
        });
      }

      const theme = pipe(
        Option.fromNullable(request.headers.get("Cookie")),
        Option.map(
          x =>
            Object.fromEntries(
              x
                .split("; ")
                .map(x => x.split("="))
                .filter(x => x.length === 2),
            ) as Record<string, string>,
        ),
        Option.flatMap(cookies => Option.fromNullable(cookies["theme"])),
        Option.flatMap(Theme.parseOption),
        Option.getOrElse(() => "auto" as const),
      );

      if (/^get$/i.test(request.method)) {
        if (pathname === "/hooks.css") {
          return new Response(hooksCSS, {
            headers: {
              "Content-Type": "text/css",
            },
          });
        }

        if (pathname === "/") {
          const [posts, featuredProject] = yield* _(
            Effect.all(
              [
                pipe(
                  Post.list(),
                  Effect.mapError(error =>
                    createHttpError(
                      500,
                      "An error occurred while listing posts.",
                      { cause: Post.printListError(error) },
                    ),
                  ),
                ),
                pipe(
                  Project.getFeatured(),
                  Effect.mapError(error =>
                    createHttpError(
                      500,
                      "An error occurred while getting the featured project.",
                      { cause: Project.printGetFeaturedError(error) },
                    ),
                  ),
                ),
              ],
              { concurrency: "unbounded" },
            ),
          );

          const latestPost = pipe(
            posts,
            ReadonlyArray.sort(Post.newestFirst),
            Option.fromIterable,
          );

          return new Response(
            htmlDoctype +
              HTML.render(
                <HomePage
                  theme={theme}
                  pathname={pathname}
                  latestPost={Option.getOrUndefined(latestPost)}
                  featuredProject={Option.getOrUndefined(featuredProject)}
                />,
              ),
            {
              headers: {
                "Content-Type": "text/html",
              },
            },
          );
        }

        if (pathname === "/projects") {
          const projects = yield* _(
            Project.list(),
            Effect.mapError(error =>
              createHttpError(
                500,
                "An error occurred while listing projects.",
                { cause: Project.printListError(error) },
              ),
            ),
          );

          return new Response(
            htmlDoctype +
              HTML.render(
                <ProjectsPage
                  theme={theme}
                  pathname={pathname}
                  projects={projects}
                />,
              ),
            {
              headers: {
                "Content-Type": "text/html",
              },
            },
          );
        }

        if (pathname === "/about") {
          const page = yield* _(
            Page.getByName("about"),
            Effect.mapError(error =>
              createHttpError(
                500,
                "An error occurred while fetching the about page content.",
                { cause: Page.printGetByNameError(error) },
              ),
            ),
          );

          const content = yield* _(
            Markdown.render(page.content, { pathname }),
            Effect.mapError(error =>
              createHttpError(
                500,
                "An error occurred while rendering the markdown content as HTML.",
                {
                  content: page.content,
                  cause: Markdown.printRenderError(error),
                },
              ),
            ),
          );

          return new Response(
            htmlDoctype +
              HTML.render(
                <AboutPage
                  theme={theme}
                  pathname={pathname}
                  content={content}
                />,
              ),
            {
              headers: {
                "Content-Type": "text/html",
              },
            },
          );
        }

        if (pathname === "/posts") {
          const posts = yield* _(
            Post.list(),
            Effect.mapError(error =>
              createHttpError(500, "An error occurred while listing posts.", {
                cause: Post.printListError(error),
              }),
            ),
          );

          return new Response(
            htmlDoctype +
              HTML.render(
                <PostsPage theme={theme} pathname={pathname} posts={posts} />,
              ),
            {
              headers: {
                "Content-Type": "text/html",
              },
            },
          );
        }

        const postsMatch = pathname.match(/^\/posts\/([a-z\-]+)(\/(.+))?$/);
        const postName = Option.fromNullable(postsMatch?.[1]);
        const postResource = Option.fromNullable(postsMatch?.[3]);

        if (Option.isSome(postName)) {
          const name = postName.value;

          const post = yield* _(
            Post.getByName(name),
            Effect.mapError(
              flow(
                Match.type<
                  Effect.Effect.Error<ReturnType<typeof Post.getByName>>
                >().pipe(
                  Match.tag(
                    "NotFoundError",
                    error => [404, true, error] as const,
                  ),
                  Match.orElse(error => [500, false, error] as const),
                ),
                ([status, expose, error]) =>
                  createHttpError(status, Post.printGetByNameError(error), {
                    expose,
                  }),
              ),
            ),
          );

          if (Option.isSome(postResource)) {
            if (postResource.value === "opengraph.png") {
              return yield* _(
                HTML.renderImage(
                  <PostOpengraphImage post={post} />,
                  PostOpengraphImageMeta,
                ),
                Effect.mapBoth({
                  onFailure(cause) {
                    return createHttpError(
                      500,
                      "An error occurred while rendering the Opengraph image.",
                      { cause },
                    );
                  },
                  onSuccess(body) {
                    return new Response(body, {
                      headers: {
                        "Content-Type": "image/png",
                      },
                    });
                  },
                }),
              );
            }

            return new Response(null, {
              status: 302,
              headers: {
                Location: `https://github.com/nsaunders/writing/raw/master/posts/${name}/${postResource.value}`,
              },
            });
          }

          const content = yield* _(
            Markdown.render(post.content, { pathname }),
            Effect.mapError(inner =>
              createHttpError(
                500,
                "An error occurred while rendering the markdown content.",
                { post: post.name, inner },
              ),
            ),
          );

          return new Response(
            htmlDoctype +
              HTML.render(
                <PostPage
                  theme={theme}
                  pathname={pathname}
                  post={{ ...post, content }}
                />,
              ),
            {
              headers: {
                "Content-Type": "text/html",
              },
            },
          );
        }
      }

      return yield* _(
        Asset,
        Effect.flatMap(assets => assets.get(pathname)),
        Effect.orElseFail(() =>
          createHttpError(404, `No resource exists at path ${pathname}`),
        ),
        Effect.flatMap(res =>
          pipe(
            res.arrayBuffer,
            Effect.map(body => new Response(body, { headers: res.headers })),
          ),
        ),
        Effect.orElseFail(() =>
          createHttpError(
            500,
            `An error occurred while reading the response for ${pathname}.`,
          ),
        ),
      );
    });

    return pipe(
      handler,
      Effect.provideService(Asset, createAsset(env, ctx.waitUntil.bind(ctx))),
      Effect.either,
      Effect.flatMap(
        Either.match({
          onLeft: error => {
            if (error.expose) {
              return Effect.succeed(
                new Response(error.message, { status: error.status }),
              );
            }
            return pipe(
              Console.error(error),
              Effect.map(
                () =>
                  new Response(
                    "I'm sorry, but I'm unable to fulfill your request due to an error. It's not your fault. Please try again.",
                    { status: 500 },
                  ),
              ),
            );
          },
          onRight: Effect.succeed,
        }),
      ),
      Effect.runPromise,
    );
  },
};
