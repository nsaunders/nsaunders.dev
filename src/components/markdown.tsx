import type { ComponentProps, CSSProperties } from "react";
import { isValidElement } from "react";
import ReactMarkdown from "react-markdown";
import { pipe } from "remeda";
import getSlug from "slug";

import { darkMode, groupHover, merge, on } from "../css.ts";
import { gray, white } from "../design/colors.ts";
import { monospace } from "../design/fonts.ts";
import { SyntaxHighlighter } from "./syntax-highlighter.tsx";
import { TextLink } from "./text-link.js";

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

function makeHeading(level: 1 | 2 | 3 | 4 | 5 | 6, style: CSSProperties) {
  const Tag = `h${level}` as const;
  return (({
    children,
    is: _is,
    ref: _ref,
    node: _node,
    style: styleProp,
    ...restProps
  }) => {
    const slug = getSlug(getText(children));
    return (
      <Tag
        id={slug}
        className="group"
        style={pipe(style, merge(styleProp))}
        {...restProps}>
        <a
          href={`#${slug}`}
          style={{
            float: "left",
            marginTop: "calc((1lh - 20px) / 2)",
            marginLeft: -28,
            marginRight: 8,
            color: "inherit",
            lineHeight: 1.5,
          }}>
          <div
            style={pipe(
              {
                visibility: "hidden",
                width: 20,
                fontSize: 0,
              },
              on(groupHover, {
                visibility: "visible",
              }),
            )}>
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
        </a>
        <span>{children}</span>
      </Tag>
    );
  }) satisfies Exclude<
    ComponentProps<typeof ReactMarkdown>["components"],
    null | undefined
  >[typeof Tag];
}

export function Markdown({
  components,
  ...restProps
}: ComponentProps<typeof ReactMarkdown>) {
  return (
    <ReactMarkdown
      components={{
        a({ is: _is, node: _node, ...props }) {
          return <TextLink as="a" {...props} />;
        },
        blockquote({ is: _is, node: _node, ref: _ref, style, ...props }) {
          return (
            <blockquote
              {...props}
              style={pipe(
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
              )}
            />
          );
        },
        code({
          children,
          className,
          is: _is,
          node: _node,
          ref: _ref,
          style,
          ...rest
        }) {
          const [_, lang] = /language-(\w+)/.exec(className || "") || [];
          return lang && typeof children === "string" ? (
            <SyntaxHighlighter
              language={lang}
              style={pipe(
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
              )}>
              {children}
            </SyntaxHighlighter>
          ) : (
            <code
              {...rest}
              className={className}
              style={{ fontFamily: monospace }}>
              {children}
            </code>
          );
        },
        h1: makeHeading(1, {
          fontSize: 36,
          fontWeight: "normal",
          lineHeight: "56px",
          marginBlock: 18,
        }),
        h2: makeHeading(2, {
          fontSize: 30,
          fontWeight: "normal",
          lineHeight: "48px",
          marginBlock: 22,
        }),
        h3: makeHeading(3, {
          fontSize: 24,
          fontWeight: "normal",
          lineHeight: "36px",
          marginBlock: 24,
        }),
        h4: makeHeading(4, {
          fontSize: 20,
          fontWeight: "bold",
          lineHeight: "24px",
          marginBlock: 28,
        }),
        h5: makeHeading(5, {
          fontSize: 17,
          fontWeight: "bold",
          lineHeight: "20px",
          marginBlock: 30,
        }),
        h6: makeHeading(6, {
          fontSize: 14,
          fontWeight: "bold",
          lineHeight: "20px",
          marginBlock: 30,
        }),
        img({ is: _is, node: _node, ref: _ref, style, ...restProps }) {
          return (
            <img
              style={pipe({ maxWidth: "100%" }, merge(style))}
              {...restProps}
            />
          );
        },
        ...components,
      }}
      {...restProps}
    />
  );
}
