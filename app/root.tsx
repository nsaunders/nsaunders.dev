import "./global.css";

import { Links, Meta, NavLink, Outlet, Scripts } from "@remix-run/react";

import { Box, StyleSheet } from "~/reusable/box.js";
import { black, blue, gray, red } from "~/reusable/colors.js";
import { Logo } from "~/reusable/logo.js";

import { createMeta } from "./data/meta.js";
import { ClientOnly } from "./reusable/client-only.js";
import { Link } from "./reusable/link.js";
import { ScreenReaderOnly } from "./reusable/screen-reader-only.js";
import { TextLink } from "./reusable/text-link.js";
import { Vr } from "./reusable/vr.js";

export const meta = createMeta(() => ({
  title: "Nick Saunders",
  description: "Nick Saunders' technical profile and blog",
}));

const themeAttr = "data-theme";
const themeKey = "pref.theme";

const themes = ["auto", "dark", "light"] as const;

function ThemeSwitcher() {
  return (
    <>
      <Box display="grid" placeItems="center" is="label">
        <Box
          is="select"
          order={1}
          gridColumn={1}
          gridRow={1}
          width={24}
          height={24}
          backgroundColor="transparent"
          borderWidth={0}
          color="transparent"
          outlineWidth={0}
          focus:outlineWidth={2}
          outlineColor={gray(70)}
          outlineStyle="solid"
          outlineOffset={4}
          onChange={e => {
            localStorage.setItem(themeKey, e.target.value);
            document
              .querySelector("html")
              ?.setAttribute(themeAttr, e.target.value);
          }}>
          {themes.map(theme => (
            <Box key={theme} is="option" backgroundColor="#fff" color="#000">
              {theme}
            </Box>
          ))}
        </Box>
        <Box
          is="svg"
          gridColumn={1}
          gridRow={1}
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          siblingHover:stroke={blue(40)}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round">
          <Box
            is="path"
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            display="none"
            dark:display="unset"
          />
          <Box is="g" dark:display="none">
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </Box>
        </Box>
        <ScreenReaderOnly>Theme</ScreenReaderOnly>
      </Box>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.currentScript.previousElementSibling.value = document.querySelector("html").getAttribute(${JSON.stringify(themeAttr)})`,
        }}
      />
    </>
  );
}

const themeInitScript = `
  (function() {
    var theme = localStorage.getItem(${JSON.stringify(themeKey)});
    if (~${JSON.stringify(themes)}.indexOf(theme)) {
      return document.querySelector("html").setAttribute(${JSON.stringify(themeAttr)}, theme);
    }
    return document.querySelector("html").setAttribute(${JSON.stringify(themeAttr)}, "auto");
  })();
`
  .split("\n")
  .map(x => x.trim())
  .join("");

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ overflowY: "scroll" }} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }}></script>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon-32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-128.png" sizes="128x128" />
        <link rel="icon" href="/favicon-180.png" sizes="180x180" />
        <link rel="icon" href="/favicon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/favicon-180.png" sizes="180x180" />
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
        backgroundColor={gray(10)}
        color={gray(90)}
        dark:backgroundColor={gray(90)}
        dark:color={gray(10)}>
        <Box
          is="header"
          data-theme="dark"
          display="flex"
          justifyContent="space-around"
          backgroundColor={black}
          color={gray(10)}
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
              hoverUnselected:color={blue(40)}
              activeUnselected:color={red(40)}
              outlineColor={gray(70)}
              outlineStyle="solid"
              outlineWidth={0}
              outlineOffset={4}
              focus:outlineWidth={2}
              display="flex">
              <Logo />
              <ScreenReaderOnly>Home</ScreenReaderOnly>
            </Box>
            <Box display="flex" gap="inherit">
              <Box
                is="nav"
                fontFamily="'Montserrat', sans-serif"
                fontWeight={600}
                letterSpacing="0.08em"
                display="contents">
                {["Posts", "Projects", "About"].map(x => (
                  <Box
                    key={x}
                    is={NavLink}
                    reloadDocument
                    to={`/${x.toLowerCase()}`}
                    color="inherit"
                    hoverUnselected:color={blue(40)}
                    activeUnselected:color={red(40)}
                    fontSize={14}
                    textDecorationLine="underline"
                    textDecorationThickness={2}
                    textUnderlineOffset={6}
                    textDecorationColor="transparent"
                    selected:textDecorationColor={blue(40)}
                    outlineStyle="solid"
                    outlineColor={gray(70)}
                    outlineWidth={0}
                    outlineOffset={4}
                    focus:outlineWidth={2}>
                    {x}
                  </Box>
                ))}
              </Box>
              <Box width={1} height={24}>
                <Vr />
              </Box>
              <ThemeSwitcher />
            </Box>
          </Box>
        </Box>
        <Box flexGrow={1}>{children}</Box>
        <Box
          is="footer"
          fontSize={14}
          color={gray(70)}
          dark:color={gray(30)}
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
        <Scripts />
      </Box>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
