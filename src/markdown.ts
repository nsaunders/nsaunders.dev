import { type RendererObject, marked } from "marked";
import { getHighlighter } from "shiki";
import slug from "slug";
import { css, renderToString } from "~/css";
import * as V from "varsace";
import { anchorStyle } from "~/components/anchor";

const languages = [
  "css",
  "html",
  "javascript",
  "json",
  "jsx",
  "typescript",
  "tsx",
];

async function getRenderer(): Promise<RendererObject> {
  const { codeToHtml } = await getHighlighter({
    themes: ["github-dark", "github-light"],
    langs: languages,
  });
  return {
    blockquote(quote) {
      return `<blockquote style="${renderToString(
        css({
          borderWidth: 0,
          borderLeftWidth: "8px",
          borderStyle: "solid",
          padding: "0.1px",
          paddingLeft: "1em",
          marginLeft: 0,
          borderColor: V.pink20,
          color: V.gray70,
          background: V.gray05,
          on: $ => [
            $("@media (prefers-color-scheme: dark)", {
              borderColor: V.pink60,
              background: V.gray85,
              color: V.gray30,
            }),
          ],
        }),
      )}">${quote}</blockquote>`;
    },
    code(code, language, escaped) {
      if (!escaped && language && languages.includes(language)) {
        return `<div style="${renderToString(
          css({
            overflow: "auto",
            background: V.white,
            fontFamily: "'Inconsolata Variable', monospace",
            padding: "1rem 1.25rem",
            on: $ => [
              $("@media (prefers-color-scheme: light)", {
                boxShadow: `inset 0 0 0 1px ${V.gray20}`,
              }),
              $("@media (prefers-color-scheme: dark)", {
                background: V.gray85,
              }),
            ],
          }),
        )}">${codeToHtml(code, {
          lang: language,
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          defaultColor: false,
        })}</div>`;
      }
      return false;
    },
    codespan(text) {
      return `<code style="${renderToString({
        fontFamily: "'Inconsolata Variable', monospace",
      })}">${text}</code>`;
    },
    heading(text, level) {
      if (
        level === 1 ||
        level === 2 ||
        level === 3 ||
        level === 4 ||
        level === 5 ||
        level === 6
      ) {
        return `<h${level} id="${slug(
          text,
        )}" class="group" style="${renderToString({
          ...[
            {
              fontSize: "3rem",
              fontWeight: 400,
              marginBlock: "1.25rem",
            },
            {
              fontSize: "2.601rem",
              fontWeight: 400,
              marginBlock: "1.5rem",
            },
            {
              fontSize: "2.2rem",
              fontWeight: 400,
              marginBlock: "1.75rem",
            },
            {
              fontSize: "1.8rem",
              fontWeight: 400,
              marginBlock: "2rem",
            },
            {
              fontSize: "1.4rem",
              fontWeight: 400,
              marginBlock: "2.25rem",
            },
            {
              fontSize: "1rem",
              fontWeight: 400,
              marginBlock: "2.5rem",
            },
          ][level - 1],
          lineHeight: 1.25,
        })}"><a href="#${slug(text)}" style="${renderToString({
          float: "left",
          marginLeft: "-28px",
          paddingRight: "8px",
          color: "inherit",
        })}"><div style="${renderToString(
          css({
            visibility: "hidden",
            width: "20px",
            on: $ => [
              $(".group:hover &", {
                visibility: "visible",
              }),
            ],
          }),
        )}"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></div></a><span>${text}</span></h${level}>`;
      }
      return false;
    },
    link(href, title, label) {
      return `<a href="${href}"${
        title ? ` title="${title}"` : ""
      } style="${renderToString(anchorStyle())}">${label}</a>`;
    },
  };
}

export async function render(markdown: string): Promise<string> {
  const renderer = await getRenderer();
  return await marked
    .use({
      gfm: true,
      renderer,
    })
    .parse(markdown);
}
