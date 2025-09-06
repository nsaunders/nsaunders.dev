import type { ComponentProps, CSSProperties } from "react";
import { isValidElement } from "react";
import ReactMarkdownImpl from "react-markdown";
import remarkRemoveComments from "remark-remove-comments";
import { pipe } from "remeda";
import {
  _a,
  a,
  blockquote,
  code,
  component,
  div,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  img,
  path,
  span$,
  svg,
} from "renuel";
import getSlug from "slug";

import { darkMode, groupHover, merge, on } from "../css.ts";
import { black, gray, white } from "../design/colors.ts";
import { monospace } from "../design/fonts.ts";
import { SyntaxHighlighter } from "./syntax-highlighter.ts";
import { TextLink$ } from "./text-link.js";

function getText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") {
    return node.toString();
  }

  if (typeof node === "boolean" && node) {
    return "true";
  }

  if (Array.isArray(node)) {
    return node.map(x => getText(x)).join("");
  }

  if (
    isValidElement(node) &&
    node.props &&
    typeof node.props === "object" &&
    "children" in node.props
  ) {
    return getText(node.props.children);
  }

  return "";
}

function makeHeading(
  factory:
    | typeof h1
    | typeof h2
    | typeof h3
    | typeof h4
    | typeof h5
    | typeof h6,
  style: CSSProperties,
) {
  return (({
    children,
    is: _is,
    ref: _ref,
    node: _node,
    style: styleProp,
    ...restProps
  }) => {
    const slug = getSlug(getText(children));
    return factory(
      {
        id: slug,
        className: "group",
        style: pipe(style, merge(styleProp)),
        ...restProps,
      },
      a(
        {
          href: `#${slug}`,
          style: {
            float: "left",
            marginTop: "calc((1lh - 20px) / 2)",
            marginLeft: -28,
            marginRight: 8,
            color: "inherit",
            lineHeight: 1.5,
          },
        },
        div(
          {
            style: pipe(
              {
                visibility: "hidden",
                width: 20,
                fontSize: 0,
              },
              on(groupHover, {
                visibility: "visible",
              }),
            ),
          },
          svg(
            {
              width: 20,
              height: 20,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
            [
              "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71",
              "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
            ].map(d => path({ key: d, d })),
          ),
        ),
      ),
      span$(children),
    );
  }) satisfies Exclude<
    ComponentProps<typeof ReactMarkdown>["components"],
    null | undefined
  >["h1"];
}

const { ReactMarkdown } = component("ReactMarkdown", ReactMarkdownImpl);

export const { Markdown, Markdown$ } = component(
  "Markdown",
  ({
    children,
    components,
    remarkPlugins,
    ...restProps
  }: ComponentProps<typeof ReactMarkdownImpl>) =>
    ReactMarkdown(
      {
        remarkPlugins: (
          [remarkRemoveComments] as Exclude<
            typeof remarkPlugins,
            null | undefined
          >
        ).concat(remarkPlugins || []),
        components: {
          a: ({ is: _is, node: _node, ...props }) => TextLink$(_a(props)),
          blockquote: ({ is: _is, node: _node, ref: _ref, style, ...props }) =>
            blockquote({
              style: pipe(
                {
                  marginLeft: 0,
                  paddingBlock: 8,
                  paddingInline: 32,
                  borderColor: gray(30),
                  borderStyle: "solid",
                  borderWidth: 0,
                  borderInlineStartWidth: 4,
                },
                on(darkMode, {
                  borderColor: gray(70),
                }),
                merge(style),
              ),
              ...props,
            }),
          code: ({
            children,
            className,
            is: _is,
            node: _node,
            ref: _ref,
            style,
            ...rest
          }) => {
            const [_, lang] = /language-(\w+)/.exec(className || "") || [];
            return lang && typeof children === "string"
              ? SyntaxHighlighter(
                  {
                    language: lang,
                    style: pipe(
                      {
                        backgroundColor: white,
                        borderColor: gray(20),
                        borderStyle: "solid",
                        borderWidth: 1,
                        fontFamily: monospace,
                        padding: 32,
                        overflowX: "auto",
                      },
                      on(darkMode, {
                        backgroundColor: gray(91),
                        borderWidth: 0,
                      }),
                      merge(style),
                    ),
                  },
                  children,
                )
              : code(
                  {
                    ...rest,
                    className,
                    style: pipe(
                      {
                        fontFamily: monospace,
                        background: white,
                      },
                      on(darkMode, {
                        background: black,
                      }),
                      merge(style),
                    ),
                  },
                  children,
                );
          },
          h1: makeHeading(h1, {
            fontSize: 36,
            fontWeight: "normal",
            lineHeight: "56px",
            marginBlock: 18,
          }),
          h2: makeHeading(h2, {
            fontSize: 30,
            fontWeight: "normal",
            lineHeight: "48px",
            marginBlock: 22,
          }),
          h3: makeHeading(h3, {
            fontSize: 24,
            fontWeight: "normal",
            lineHeight: "36px",
            marginBlock: 24,
          }),
          h4: makeHeading(h4, {
            fontSize: 20,
            fontWeight: "bold",
            lineHeight: "24px",
            marginBlock: 28,
          }),
          h5: makeHeading(h5, {
            fontSize: 17,
            fontWeight: "bold",
            lineHeight: "20px",
            marginBlock: 30,
          }),
          h6: makeHeading(h6, {
            fontSize: 14,
            fontWeight: "bold",
            lineHeight: "20px",
            marginBlock: 30,
          }),
          img: ({ is: _is, node: _node, ref: _ref, style, ...restProps }) =>
            img({
              style: pipe({ maxWidth: "100%" }, merge(style)),
              ...restProps,
            }),
          ...components,
        },
        ...restProps,
      },
      children,
    ),
);
