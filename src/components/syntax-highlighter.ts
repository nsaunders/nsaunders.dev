import type { CSSProperties } from "react";
import { use } from "react";
import { component, div } from "renuel";
import { codeToHtml } from "shiki";

export const { SyntaxHighlighter } = component(
  "SyntaxHighlighter",
  ({
    children: code,
    language,
    style,
  }: {
    children: string;
    language: Parameters<typeof codeToHtml>[1]["lang"];
    style?: CSSProperties;
  }) =>
    div({
      style,
      dangerouslySetInnerHTML: {
        __html: use(
          codeToHtml(code, {
            lang: language,
            themes: { light: "github-light", dark: "github-dark" },
            defaultColor: false,
          }),
        ).replace(
          /^\s*<pre([\S\s]*)\/pre>\s*$/m,
          (_, content) => `<div${content}/div>`,
        ),
      },
    }),
);
