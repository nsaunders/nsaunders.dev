import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { isValidElement } from "react";
import type Markdown from "react-markdown";
import getSlug from "slug";

import { resolveURL as resolveURLImpl } from "../data/resolve-url.js";
import { Box } from "./box.js";
import { gray, white } from "./colors.js";
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
      <Box
        as="a"
        href={`#${slug}`}
        float="left"
        marginTop="calc((1lh - 20px) / 2)"
        marginLeft={-28}
        paddingRight={8}
        color="inherit">
        <Box
          visibility="hidden"
          groupHover:visibility="visible"
          width={20}
          fontSize={0}>
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
        </Box>
      </Box>
      <Box as="span">{children}</Box>
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
    blockquote({ is: _is, node: _node, ref: _ref, ...props }) {
      return (
        <Box
          as="blockquote"
          {...props}
          paddingBlock={8}
          paddingInline={32}
          borderColor={gray(30)}
          dark:borderColor={gray(70)}
          borderStyle="solid"
          borderWidth={0}
          borderInlineStartWidth={4}
        />
      );
    },
    code({ children, className, is: _is, node: _node, ref: _ref, ...rest }) {
      const [_, lang] = /language-(\w+)/.exec(className || "") || [];
      return lang && typeof children === "string" ? (
        <Box
          backgroundColor={white}
          borderColor={gray(20)}
          borderStyle="solid"
          borderWidth={1}
          fontFamily={monospace}
          dark:backgroundColor={gray(91)}
          dark:borderWidth={0}
          padding={32}
          overflowX="auto"
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
        <Box {...rest} as="code" className={className} fontFamily={monospace}>
          {children}
        </Box>
      );
    },
    h1({ children, is: _is, ref: _ref, node: _node, ...props }) {
      const slug = getSlug(getText(children));
      return (
        <Box
          as="h1"
          id={slug}
          className="group"
          fontSize={36}
          fontWeight="normal"
          lineHeight="44px"
          marginBlock={18}
          {...props}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </Box>
      );
    },
    h2({ children, is: _is, ref: _ref, node: _node, ...props }) {
      const slug = getSlug(getText(children));
      return (
        <Box
          as="h2"
          id={slug}
          className="group"
          fontSize={30}
          fontWeight="normal"
          lineHeight="36px"
          marginBlock={22}
          {...props}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </Box>
      );
    },
    h3({ children, is: _is, ref: _ref, node: _node, ...props }) {
      const slug = getSlug(getText(children));
      return (
        <Box
          as="h3"
          id={slug}
          className="group"
          fontSize={24}
          fontWeight="normal"
          lineHeight="32px"
          marginBlock={24}
          {...props}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </Box>
      );
    },
    h4({ children, is: _is, ref: _ref, node: _node, ...props }) {
      const slug = getSlug(getText(children));
      return (
        <Box
          as="h4"
          id={slug}
          className="group"
          fontSize={20}
          fontWeight="bold"
          lineHeight="24px"
          marginBlock={28}
          {...props}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </Box>
      );
    },
    h5({ children, is: _is, ref: _ref, node: _node, ...props }) {
      const slug = getSlug(getText(children));
      return (
        <Box
          as="h5"
          id={slug}
          className="group"
          fontSize={17}
          fontWeight="bold"
          lineHeight="20px"
          marginBlock={30}
          {...props}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </Box>
      );
    },
    h6({ children, is: _is, ref: _ref, node: _node, ...props }) {
      const slug = getSlug(getText(children));
      return (
        <Box
          as="h6"
          id={slug}
          className="group"
          fontSize={14}
          fontWeight="bold"
          lineHeight="20px"
          marginBlock={30}
          {...props}>
          <HeadingContent slug={slug}>{children}</HeadingContent>
        </Box>
      );
    },
    img({ alt, is: _is, node: _node, ref: _ref, src, ...props }) {
      return (
        <Box
          as="img"
          src={resolveURL(src || "")}
          alt={alt}
          maxWidth="100%"
          {...props}
        />
      );
    },
  };
};
