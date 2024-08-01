import type { ComponentPropsWithoutRef } from "react";
import type Markdown from "react-markdown";

import { Box } from "./box.js";
import { gray, white } from "./colors.js";
import { monospace } from "./fonts.js";
import type { highlighter } from "./highlighter.js";
import { TextLink } from "./text-link.js";

export const markdownComponents = (options: {
  highlighter: Awaited<ReturnType<typeof highlighter>>;
  basePath: string;
}): ComponentPropsWithoutRef<typeof Markdown>["components"] => {
  function resolveURL(relativeOrAbsoluteURL: string) {
    const dummyOrigin = "http://dummy";

    try {
      return new URL(relativeOrAbsoluteURL).href;
    } catch (e) {
      const baseURL = new URL(options.basePath, dummyOrigin);
      return new URL(relativeOrAbsoluteURL, baseURL).pathname;
    }
  }

  return {
    a({ is: _is, node: _node, ...props }) {
      return <TextLink is="a" {...props} />;
    },
    blockquote({ is: _is, node: _node, ref: _ref, ...props }) {
      return (
        <Box
          is="blockquote"
          {...props}
          paddingBlock={8}
          paddingInline={32}
          borderColor={gray[30]}
          dark:borderColor={gray[70]}
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
          borderColor={gray[20]}
          borderStyle="solid"
          borderWidth={1}
          fontFamily={monospace}
          dark:backgroundColor={gray[91]}
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
        <Box {...rest} is="code" className={className} fontFamily={monospace}>
          {children}
        </Box>
      );
    },
    h1({ is: _is, ref: _ref, node: _node, ...props }) {
      return (
        <Box
          is="h1"
          fontSize={36}
          fontWeight="normal"
          lineHeight="44px"
          marginBlock={18}
          {...props}
        />
      );
    },
    h2({ is: _is, ref: _ref, node: _node, ...props }) {
      return (
        <Box
          is="h2"
          fontSize={30}
          fontWeight="normal"
          lineHeight="36px"
          marginBlock={22}
          {...props}
        />
      );
    },
    h3({ is: _is, ref: _ref, node: _node, ...props }) {
      return (
        <Box
          is="h3"
          fontSize={24}
          fontWeight="normal"
          lineHeight="32px"
          marginBlock={24}
          {...props}
        />
      );
    },
    h4({ is: _is, ref: _ref, node: _node, ...props }) {
      return (
        <Box
          is="h4"
          fontSize={20}
          fontWeight="bold"
          lineHeight="24px"
          marginBlock={28}
          {...props}
        />
      );
    },
    h5({ is: _is, ref: _ref, node: _node, ...props }) {
      return (
        <Box
          is="h5"
          fontSize={17}
          fontWeight="bold"
          lineHeight="20px"
          marginBlock={30}
          {...props}
        />
      );
    },
    h6({ is: _is, ref: _ref, node: _node, ...props }) {
      return (
        <Box
          is="h6"
          fontSize={14}
          fontWeight="bold"
          lineHeight="20px"
          marginBlock={30}
          {...props}
        />
      );
    },
    img({ alt, is: _is, node: _node, ref: _ref, src, ...props }) {
      return (
        <Box
          is="img"
          src={resolveURL(src || "")}
          alt={alt}
          maxWidth="100%"
          {...props}
        />
      );
    },
  };
};
