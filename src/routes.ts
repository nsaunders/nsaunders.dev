import type { RouteConfig } from "@react-router/dev/routes";
import { index, prefix, route } from "@react-router/dev/routes";

export default [
  index("routes/home.ts"),
  ...prefix(
    "icons",
    prefix(":width", prefix(":height", [route("icon.png", "routes/icon.ts")])),
  ),
  route("about", "./routes/about.ts"),
  ...prefix(
    "optimized",
    prefix(":width", prefix(":height", [route("*", "routes/optimized.ts")])),
  ),
  route("manifest.json", "./routes/manifest.ts"),
  ...prefix("posts", [
    index("./routes/posts.ts"),
    ...prefix(":name", [
      index("./routes/post.ts"),
      route("opengraph.png", "routes/post-opengraph.ts"),
      route("*", "routes/post-asset.ts"),
    ]),
  ]),
  route("projects", "./routes/projects.ts"),
  route("robots.txt", "./routes/robots.ts"),
  route("rss.xml", "./routes/rss.ts"),
] satisfies RouteConfig;
