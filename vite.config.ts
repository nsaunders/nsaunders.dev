import "dotenv/config";

import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import rehypeShiki from "@shikijs/rehype";
import { rendererRich, transformerTwoslash } from "@shikijs/twoslash";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import type { CreateTwoslashESLintOptions } from "twoslash-eslint";
import { createTwoslasher as createEslintTwoslasher } from "twoslash-eslint";
import { defineConfig } from "vite";

import * as Env from "./env.ts";
import eslintConfig from "./eslint.config.js";

const env = Env.parse(process.env);
const runEslint = createEslintTwoslasher({
  includeDocs: false,
  eslintConfig: [
    ...eslintConfig,
    {
      rules: {
        "unused-imports/no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
      },
    },
  ] as unknown as CreateTwoslashESLintOptions["eslintConfig"],
});
const eslintTwoslasher: typeof runEslint = (...args) => {
  const result = runEslint(...args);
  if (
    !result.nodes.some(
      node =>
        node.type === "error" &&
        node.id === "@typescript-eslint/no-unused-vars",
    )
  ) {
    throw new Error("Expected an @typescript-eslint/no-unused-vars diagnostic");
  }
  return result;
};

export default defineConfig({
  define: Object.fromEntries(
    Object.entries(env).map(([name, value]) => [
      `process.env.${name}`,
      JSON.stringify(value),
    ]),
  ),
  plugins: [
    mdx({
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false,
            transformers: [
              transformerTwoslash({
                explicitTrigger: true,
                renderer: rendererRich({
                  hast: {
                    hoverCompose: ({ token }) => [token],
                    hoverToken: { class: "twoslash-static" },
                  },
                }),
              }),
              transformerTwoslash({
                explicitTrigger: /\beslint-check\b/,
                renderer: rendererRich({
                  hast: {
                    hoverCompose: ({ token }) => [token],
                    hoverToken: { class: "twoslash-static" },
                  },
                }),
                twoslasher: eslintTwoslasher,
              }),
            ],
          },
        ],
      ],
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }),
    reactRouter(),
  ],
});
