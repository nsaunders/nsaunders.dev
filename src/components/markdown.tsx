import type { MDXComponents } from "mdx/types";
import type { ComponentProps, CSSProperties } from "react";
import { isValidElement } from "react";
import getSlug from "slug";

import { darkMode, groupHover, mergeStyles, on } from "../css.ts";
import { gray } from "../design/colors.ts";
import { monospace } from "../design/fonts.ts";
import { TextLink } from "./text-link.tsx";

// Merge these with each renderer's styles so the hooks retain its fallback margins.
const markdownSpacing = [
  on(".markdown > &:first-child", { marginTop: 0 }),
  on(".markdown > &:last-child", { marginBottom: 0 }),
  on(".markdown blockquote > &:last-child", { marginBottom: 0 }),
] as const;

function getText(node: unknown): string {
  if (typeof node === "string" || typeof node === "number") {
    return node.toString();
  }
  if (typeof node === "boolean" && node) {
    return "true";
  }
  if (Array.isArray(node)) {
    return node.map(getText).join("");
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
  level: 1 | 2 | 3 | 4 | 5 | 6,
  style: CSSProperties,
  anchorMarginTop: number,
) {
  const Tag = `h${level}` as const;
  return ({
    children,
    style: styleProp,
    ...props
  }: ComponentProps<typeof Tag>) => {
    const id = getSlug(getText(children));
    return (
      <Tag
        {...props}
        id={id}
        className="group"
        style={mergeStyles(
          style,
          on(".markdown p + &", {
            marginTop: level <= 2 ? 32 : level <= 4 ? 24 : 16,
          }),
          level === 3 && on(".markdown h2 + &", { marginTop: 16 }),
          level === 4 && on(".markdown h3 + &", { marginTop: 16 }),
          ...markdownSpacing,
          styleProp,
        )}>
        <a
          href={`#${id}`}
          style={{
            float: "left",
            marginTop: anchorMarginTop,
            marginLeft: -28,
            marginRight: 8,
            color: "inherit",
            lineHeight: 1.5,
          }}>
          <div
            style={mergeStyles(
              { visibility: "hidden", width: 20, fontSize: 0 },
              on(groupHover, { visibility: "visible" }),
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
  };
}

const resolveUrl = (url: string | undefined, basePath: string) =>
  url && URL.canParse(url, `x:${basePath}`)
    ? new URL(url, `x:${basePath}`).toString().replace(/^x:/, "")
    : url;

export function markdownComponents(basePath: string): MDXComponents {
  return {
    a({ href, ...props }) {
      return <TextLink {...props} href={resolveUrl(href, basePath)} />;
    },
    p({ style, ...props }) {
      return (
        <p
          {...props}
          style={mergeStyles(
            { marginTop: 0, marginBottom: 16, marginLeft: 0, marginRight: 0 },
            on(".markdown li > &", { marginBottom: 0 }),
            ...markdownSpacing,
            style,
          )}
        />
      );
    },
    ul({ style, ...props }) {
      return (
        <ul
          {...props}
          style={mergeStyles(
            {
              marginTop: 0,
              marginBottom: 24,
              marginLeft: 0,
              marginRight: 0,
              paddingLeft: 24,
            },
            ...markdownSpacing,
            style,
          )}
        />
      );
    },
    ol({ style, ...props }) {
      return (
        <ol
          {...props}
          style={mergeStyles(
            {
              marginTop: 0,
              marginBottom: 24,
              marginLeft: 0,
              marginRight: 0,
              paddingLeft: 24,
            },
            ...markdownSpacing,
            style,
          )}
        />
      );
    },
    li({ style, ...props }) {
      return (
        <li
          {...props}
          style={mergeStyles(
            on(".markdown li + &", { marginTop: 8 }),
            ...markdownSpacing,
            style,
          )}
        />
      );
    },
    figure({ style, ...props }) {
      return (
        <figure
          {...props}
          style={mergeStyles(
            { marginTop: 24, marginBottom: 24, marginLeft: 0, marginRight: 0 },
            ...markdownSpacing,
            style,
          )}
        />
      );
    },
    blockquote({ style, ...props }) {
      return (
        <blockquote
          {...props}
          style={mergeStyles(
            {
              background: gray(15),
              borderColor: gray(30),
              borderStyle: "solid",
              borderWidth: 0,
              borderInlineStartWidth: 4,
              fontSize: 20,
              lineHeight: 1.5,
              marginTop: 24,
              marginBottom: 24,
              marginLeft: 0,
              marginRight: 0,
              padding: "16px 24px",
            },
            on(darkMode, { background: gray(80), borderColor: gray(70) }),
            ...markdownSpacing,
            style,
          )}
        />
      );
    },
    code({ style, ...props }) {
      return (
        <code
          {...props}
          style={mergeStyles(
            { fontFamily: monospace, background: gray(15) },
            on(darkMode, { background: gray(80) }),
            style,
          )}
        />
      );
    },
    pre({ style, ...props }) {
      return (
        <pre
          {...props}
          style={mergeStyles(
            {
              backgroundColor: gray(15),
              fontFamily: monospace,
              overflowX: "auto",
              boxSizing: "border-box",
              width: "100%",
              marginTop: 24,
              marginBottom: 24,
              marginLeft: 0,
              marginRight: 0,
              padding: 24,
            },
            on(darkMode, { backgroundColor: gray(85) }),
            ...markdownSpacing,
            style,
          )}
        />
      );
    },
    h1: makeHeading(
      1,
      {
        fontSize: 36,
        fontWeight: "normal",
        lineHeight: "44px",
        marginTop: 48,
        marginBottom: 16,
        marginLeft: 0,
        marginRight: 0,
      },
      12,
    ),
    h2: makeHeading(
      2,
      {
        fontSize: 30,
        fontWeight: "normal",
        lineHeight: "40px",
        marginTop: 48,
        marginBottom: 16,
        marginLeft: 0,
        marginRight: 0,
      },
      10,
    ),
    h3: makeHeading(
      3,
      {
        fontSize: 24,
        fontWeight: "normal",
        lineHeight: "32px",
        marginTop: 40,
        marginBottom: 12,
        marginLeft: 0,
        marginRight: 0,
      },
      6,
    ),
    h4: makeHeading(
      4,
      {
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: "28px",
        marginTop: 32,
        marginBottom: 12,
        marginLeft: 0,
        marginRight: 0,
      },
      4,
    ),
    h5: makeHeading(
      5,
      {
        fontSize: 17,
        fontWeight: "bold",
        lineHeight: "24px",
        marginTop: 24,
        marginBottom: 8,
        marginLeft: 0,
        marginRight: 0,
      },
      2,
    ),
    h6: makeHeading(
      6,
      {
        fontSize: 14,
        fontWeight: "bold",
        lineHeight: "20px",
        marginTop: 24,
        marginBottom: 8,
        marginLeft: 0,
        marginRight: 0,
      },
      0,
    ),
    img({ src, style, ...props }) {
      return (
        <img
          {...props}
          src={resolveUrl(src, basePath)}
          style={mergeStyles(
            {
              maxWidth: "100%",
              marginTop: 24,
              marginBottom: 24,
              marginLeft: 0,
              marginRight: 0,
              display: "block",
            },
            ...markdownSpacing,
            style,
          )}
        />
      );
    },
    wrapper({ children }) {
      return <div className="markdown">{children}</div>;
    },
  };
}
