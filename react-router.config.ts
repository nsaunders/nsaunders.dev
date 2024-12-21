import type { Config } from "@react-router/dev/config";

import * as Env from "./env.ts";
import { listPostAssetsByName, listPostsWithDetails } from "./src/data/post.ts";

Env.parse(process.env);

export default {
  ssr: true,
  appDirectory: "src",
  prerender: async ({ getStaticPaths }) => [
    ...getStaticPaths(),

    ...[32, 128, 180, 192, 512].map(x => `/icons/${x}/${x}/icon.png`),
    "/icons/1200/630/icon.png",

    ...((
      await Promise.all(
        (await listPostsWithDetails()).flatMap(async post => [
          `/posts/${post.name}`,
          ...[
            { width: 160, height: 160 },
            { width: 640, height: 360 },
            { width: 960, height: 540 },
          ]
            .map(
              ({ width, height }) =>
                URL.parse(
                  post.image.src,
                  `x:/optimized/${width}/${height}/posts/${post.name}/`,
                )?.pathname,
            )
            .filter(Boolean),
          `/posts/${post.name}/opengraph.png`,
          ...(await listPostAssetsByName(post.name)).map(
            pathname =>
              URL.parse(pathname, `x:/posts/${post.name}/`)?.pathname || "",
          ),
        ]),
      )
    ).flat() satisfies string[]),
  ],
} satisfies Config;
