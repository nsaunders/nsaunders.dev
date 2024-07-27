import "./global.css";

import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import { Box, StyleSheet } from "~/reusable/box.js";
import { black, blue, gray, red } from "~/reusable/colors.js";
import { Logo } from "~/reusable/logo.js";

import { ClientOnly } from "./reusable/client-only.js";
import { Link } from "./reusable/link.js";
import { TextLink } from "./reusable/text-link.js";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ overflowY: "scroll" }}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <StyleSheet />
      </head>
      <Box
        is="body"
        fontFamily="'Nunito Sans Variable', sans-serif"
        minHeight="100dvh"
        display="flex"
        flexDirection="column"
        alignItems="stretch"
        backgroundColor={gray[10]}
        color={gray[90]}
        dark:backgroundColor={gray[90]}
        dark:color={gray[10]}>
        <Box
          is="header"
          display="flex"
          justifyContent="space-around"
          backgroundColor={black}
          color={gray[10]}
          alignSelf="stretch">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="16px 0"
            gap={16}
            width="calc(100dvw - 32px)"
            maxWidth={960}
            backgroundColor={black}>
            <Box
              is={Link}
              to="/"
              color="inherit"
              hoverUnselected:color={blue[40]}
              activeUnselected:color={red[40]}
              outlineColor={gray[70]}
              outlineStyle="solid"
              outlineWidth={0}
              outlineOffset={4}
              focus:outlineWidth={2}
              display="flex">
              <Logo />
            </Box>
            <Box
              is="nav"
              fontFamily="'Montserrat', sans-serif"
              fontWeight={600}
              letterSpacing="0.08em"
              display="flex"
              gap="inherit">
              {["Posts", "Projects", "About"].map(x => (
                <Box
                  key={x}
                  is={NavLink}
                  to={`/${x.toLowerCase()}`}
                  color="inherit"
                  hoverUnselected:color={blue[40]}
                  activeUnselected:color={red[40]}
                  fontSize={14}
                  textDecorationLine="underline"
                  textDecorationThickness={2}
                  textUnderlineOffset={6}
                  textDecorationColor="transparent"
                  selected:textDecorationColor={blue[40]}
                  outlineStyle="solid"
                  outlineColor={gray[70]}
                  outlineWidth={0}
                  outlineOffset={4}
                  focus:outlineWidth={2}>
                  {x}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Box flexGrow={1}>{children}</Box>
        <Box
          is="footer"
          fontSize={14}
          color={gray[70]}
          dark:color={gray[30]}
          width="calc(100dvw - 32px)"
          maxWidth={960}
          margin="0 auto"
          display="flex"
          flexWrap="wrap"
          justifyContent="center"
          paddingBlock={8}>
          <Box>
            &copy; <ClientOnly>{new Date().getFullYear()}</ClientOnly> Nick
            Saunders
          </Box>
          <Box
            flexBasis="calc((360px - 100%) * 999)"
            flexGrow={1}
            flexWrap="wrap"
          />
          <Box display="flex" gap={12}>
            {Object.entries({
              GitHub: "https://github.com/nsaunders",
              LinkedIn: "https://linkedin.com/in/nicksaunders",
              X: "https://x.com/agilecoder",
              RSS: "#",
            }).map(([children, href]) => (
              <TextLink key={href} is="a" href={href}>
                {children}
              </TextLink>
            ))}
          </Box>
        </Box>
        <ScrollRestoration />
        <Scripts />
      </Box>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
