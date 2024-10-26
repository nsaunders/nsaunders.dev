import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { isValidElement } from "react";
import type Markdown from "react-markdown";
import { pipe } from "remeda";
import getSlug from "slug";

import { resolveURL as resolveURLImpl } from "../data/resolve-url.js";
import { gray, white } from "./colors.js";
import { darkMode, groupHover, merge, on } from "./css.js";
import { monospace } from "./fonts.js";
import type { highlighter } from "./highlighter.js";
import { TextLink } from "./text-link.js";

function getText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return node.toString();
  }

  if (Array.isArray(node)) {
    return node.map(getText).join("");
  }

  if (isValidElement(node)) {
    return getText(node.props.children);
  }

  return "";
}

function HeadingContent({
  children,
  slug,
}: {
  children?: ReactNode;
  slug: string;
}) {
  return (
    <>
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
    </>
  );
}

export const markdownComponents = (options: {
  highlighter: Awaited<ReturnType<typeof highlighter>>;
  basePath: string;
}): ComponentPropsWithoutRef<typeof Markdown>["components"] => {
  const resolveURL = (x: string) => resolveURLImpl(options.basePath, x);

  return {
    a({ is: _is, node: _node, ...props }) {
      return <TextLink as="a" {...props} />;
    },
    blockquote({ is: _is, node: _node, ref: _ref, style, ...props }) {
      return (
        <blockquote
          {...props}
          style={pipe(
            {
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
        <div
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
          )}
          dangerouslySetInnerHTML={{
            __html: options.highlighter.codeToHtml(children, {
              lang,
              themes: {
                dark: "github-dark",
                light: "github-light",
              },
              defaultColor: false,
            }),
          }}
        />
      ) : (
        <code {...rest} className={className} style={{ fontFamily: monospace }}>
          {children}
        </code>
      );
    },
    h1({ children, is: _is, ref: _ref, node: _node, style, ...restProps }) {
      const slug = getSlug(getText(children));
      return (
        <h1
          id={slug}
          className="group"
          style={pipe(
            {
              fontSize: 36,
              fontWeight: "normal",
              lineHeight: "56px",
              marginBlock: 18,
            },
            merge(style),
          )}
          {...restProps}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </h1>
      );
    },
    h2({ children, is: _is, ref: _ref, node: _node, style, ...restProps }) {
      const slug = getSlug(getText(children));
      return (
        <h2
          id={slug}
          className="group"
          style={pipe(
            {
              fontSize: 30,
              fontWeight: "normal",
              lineHeight: "48px",
              marginBlock: 22,
            },
            merge(style),
          )}
          {...restProps}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </h2>
      );
    },
    h3({ children, is: _is, ref: _ref, node: _node, style, ...restProps }) {
      const slug = getSlug(getText(children));
      return (
        <h3
          id={slug}
          className="group"
          style={pipe(
            {
              fontSize: 24,
              fontWeight: "normal",
              lineHeight: "36px",
              marginBlock: 24,
            },
            merge(style),
          )}
          {...restProps}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </h3>
      );
    },
    h4({ children, is: _is, ref: _ref, node: _node, style, ...restProps }) {
      const slug = getSlug(getText(children));
      return (
        <h4
          id={slug}
          className="group"
          style={pipe(
            {
              fontSize: 20,
              fontWeight: "bold",
              lineHeight: "24px",
              marginBlock: 28,
            },
            merge(style),
          )}
          {...restProps}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </h4>
      );
    },
    h5({ children, is: _is, ref: _ref, node: _node, style, ...restProps }) {
      const slug = getSlug(getText(children));
      return (
        <h5
          id={slug}
          className="group"
          style={pipe(
            {
              fontSize: 17,
              fontWeight: "bold",
              lineHeight: "20px",
              marginBlock: 30,
            },
            merge(style),
          )}
          {...restProps}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </h5>
      );
    },
    h6({ children, is: _is, ref: _ref, node: _node, style, ...restProps }) {
      const slug = getSlug(getText(children));
      return (
        <h6
          id={slug}
          className="group"
          style={pipe(
            {
              fontSize: 14,
              fontWeight: "bold",
              lineHeight: "20px",
              marginBlock: 30,
            },
            merge(style),
          )}
          {...restProps}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </h6>
      );
    },
    img({ alt, is: _is, node: _node, ref: _ref, src, style, ...restProps }) {
      return (
        <img
          src={resolveURL(src || "")}
          alt={alt}
          style={pipe({ maxWidth: "100%" }, merge(style))}
          {...restProps}
        />
      );
    },
  };
};
