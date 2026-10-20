import type { RouteConfig } from "@react-router/dev/routes";
import { index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  ...prefix(
    "icons",
    prefix(":width", prefix(":height", [route("icon.png", "routes/icon.tsx")])),
  ),
  route("about", "./routes/about.tsx"),
  ...prefix(
    "optimized",
    prefix(":width", prefix(":height", [route("*", "routes/optimized.ts")])),
  ),
  route("manifest.json", "./routes/manifest.ts"),
  ...prefix("posts", [
    index("./routes/posts.tsx"),
    ...prefix(":name", [
      index("./routes/post.tsx"),
      route("opengraph.png", "routes/post-opengraph.ts"),
      route("*", "routes/post-asset.ts"),
    ]),
  ]),
  route("projects", "./routes/projects.tsx"),
  route("robots.txt", "./routes/robots.ts"),
  route("rss.xml", "./routes/rss.ts"),
] satisfies RouteConfig;
