import "./global.css";

import { Links, Meta, NavLink, Outlet, Scripts } from "@remix-run/react";
import { pipe } from "remeda";

import { black, blue, gray, red } from "~/reusable/colors.js";
import { Logo } from "~/reusable/logo.js";

import { createMeta } from "./data/meta.js";
import { ClientOnly } from "./reusable/client-only.js";
import {
  and,
  darkMode,
  hover,
  not,
  on,
  siblingHover,
  styleSheet,
} from "./reusable/css.js";
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
      <label style={{ display: "grid", placeItems: "center" }}>
        <select
          style={pipe(
            {
              order: 1,
              gridColumn: 1,
              gridRow: 1,
              width: 24,
              height: 24,
              backgroundColor: "transparent",
              borderWidth: 0,
              color: "transparent",
              outlineWidth: 0,
              outlineColor: gray(70),
              outlineStyle: "solid",
              outlineOffset: 4,
            },
            on("&:focus-visible", {
              outlineWidth: 2,
            }),
          )}
          onChange={e => {
            localStorage.setItem(themeKey, e.target.value);
            document
              .querySelector("html")
              ?.setAttribute(themeAttr, e.target.value);
          }}>
          {themes.map(theme => (
            <option
              key={theme}
              style={{ backgroundColor: "#fff", color: "#000" }}>
              {theme}
            </option>
          ))}
        </select>
        <svg
          style={pipe(
            {
              gridColumn: 1,
              gridRow: 1,
              width: 16,
              height: 16,
              stroke: "currentColor",
            },
            on(siblingHover, {
              stroke: blue(40),
            }),
          )}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round">
          <path
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
            style={pipe(
              {
                display: "none",
              },
              on(darkMode, {
                display: "unset",
              }),
            )}
          />
          <g style={pipe({}, on(darkMode, { display: "none" }))}>
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
        <ScreenReaderOnly>Theme</ScreenReaderOnly>
      </label>
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
        <style dangerouslySetInnerHTML={{ __html: styleSheet() }} />
      </head>
      <body
        style={pipe(
          {
            margin: 0,
            fontFamily: "'Nunito Sans Variable', sans-serif",
            lineHeight: 1.5,
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            backgroundColor: gray(10),
            color: gray(90),
          },
          on(darkMode, {
            backgroundColor: gray(90),
            color: gray(10),
          }),
        )}>
        <header
          data-theme="dark"
          style={{
            display: "flex",
            justifyContent: "space-around",
            backgroundColor: black,
            color: gray(10),
            alignSelf: "stretch",
          }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 0",
              gap: 16,
              width: "calc(100dvw - 32px)",
              maxWidth: 960,
            }}>
            <Link
              to="/"
              style={pipe(
                {
                  display: "flex",
                  color: "inherit",
                  outlineColor: gray(70),
                  outlineStyle: "solid",
                  outlineWidth: 0,
                  outlineOffset: 4,
                },
                on(and(hover, not("&.active")), {
                  color: blue(40),
                }),
                on(and("&:active", not("&.active")), {
                  color: red(40),
                }),
                on("&:focus-visible", {
                  outlineWidth: 2,
                }),
              )}>
              <Logo />
              <ScreenReaderOnly>Home</ScreenReaderOnly>
            </Link>
            <div style={{ display: "flex", gap: "inherit" }}>
              <nav
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  lineHeight: 12 / 7,
                  display: "contents",
                }}>
                {["Posts", "Projects", "About"].map(x => (
                  <NavLink
                    key={x}
                    reloadDocument
                    to={`/${x.toLowerCase()}`}
                    style={pipe(
                      {
                        color: "inherit",
                        fontSize: 14,
                        textDecorationLine: "underline",
                        textDecorationThickness: 2,
                        textUnderlineOffset: 6,
                        textDecorationColor: "transparent",
                        outlineStyle: "solid",
                        outlineColor: gray(70),
                        outlineWidth: 0,
                        outlineOffset: 4,
                      },
                      on(and(hover, not("&.active")), {
                        color: blue(40),
                      }),
                      on(and("&:active", not("&.active")), {
                        color: red(40),
                      }),
                      on("&.active", {
                        textDecorationColor: blue(40),
                      }),
                      on("&:focus-visible", {
                        outlineWidth: 2,
                      }),
                    )}>
                    {x}
                  </NavLink>
                ))}
              </nav>
              <Vr style={{ height: 24 }} />
              <ThemeSwitcher />
            </div>
          </div>
        </header>
        <div style={{ flexGrow: 1 }}>{children}</div>
        <footer
          style={pipe(
            {
              fontSize: 14,
              lineHeight: 12 / 7,
              color: gray(70),
              width: "calc(100dvw - 32px)",
              maxWidth: 960,
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              paddingBlock: 8,
            },
            on(darkMode, {
              color: gray(30),
            }),
          )}>
          <div>
            &copy; <ClientOnly>{new Date().getFullYear()}</ClientOnly> Nick
            Saunders
          </div>
          <div
            style={{
              flexBasis: "calc((360px - 100%) * 999)",
              flexGrow: 1,
              flexWrap: "wrap",
            }}
          />
          <div style={{ display: "flex", gap: 12 }}>
            {Object.entries({
              GitHub: "https://github.com/nsaunders",
              LinkedIn: "https://linkedin.com/in/nicksaunders",
              X: "https://x.com/agilecoder",
              RSS: "/rss.xml",
            }).map(([children, href]) => (
              <TextLink key={href} as="a" href={href}>
                {children}
              </TextLink>
            ))}
          </div>
        </footer>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
