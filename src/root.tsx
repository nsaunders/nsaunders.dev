import "./global.css";

import { useEffect, useState } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { pipe } from "remeda";
import * as v from "valibot";

import type { Route } from "./+types/root.ts";
import { ClientOnly } from "./components/client-only.tsx";
import { Logo } from "./components/logo.tsx";
import { ScreenReaderOnly } from "./components/screen-reader-only.tsx";
import { TextLink } from "./components/text-link.tsx";
import { Vr } from "./components/vr.tsx";
import {
  and,
  darkMode,
  hover,
  not,
  on,
  siblingHover,
  styleSheet,
} from "./css.ts";
import { createMetaDescriptors } from "./data/meta.ts";
import { black, blue, gray, red } from "./design/colors.ts";

export const meta: Route.MetaFunction = createMetaDescriptors({
  title: "Nick Saunders",
  description: "Nick Saunders' technical profile and blog",
});

export const links: Route.LinksFunction = () => [
  ...[32, 128, 180, 192].map(x => ({
    rel: "icon",
    href: `/icons/${x}/${x}/icon.png`,
    sizes: `${x}x${x}`,
  })),
  {
    rel: "apple-touch-icon",
    href: "/icons/180/180/icon.png",
    sizes: "180x180",
  },
  {
    rel: "manifest",
    href: "/manifest.json",
  },
];

const themeAttr = "data-theme";
const themeKey = "pref.theme";
const themes = ["dark", "auto", "light"] as const;

function ThemeSwitcher() {
  const [theme, setTheme] = useState<(typeof themes)[number]>("auto");

  useEffect(() => {
    const root = document.documentElement;

    const sync = () => {
      const themeParseResult = v.safeParse(
        v.union(themes.map(theme => v.literal(theme))),
        root.getAttribute(themeAttr),
      );
      if (themeParseResult.success) {
        setTheme(themeParseResult.output);
      } else {
        root.setAttribute(themeAttr, "auto");
      }
    };

    sync();

    const obs = new MutationObserver(entries => {
      entries.slice(0, 1).forEach(sync);
    });

    obs.observe(root, { attributes: true, attributeFilter: [themeAttr] });

    return () => {
      obs.disconnect();
    };
  }, []);

  return (
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
        value={theme}
        onChange={e => {
          localStorage.setItem(themeKey, e.target.value);
          document.documentElement.setAttribute(themeAttr, e.target.value);
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
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="auto" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {var t=localStorage.getItem(${JSON.stringify(themeKey)});if (${JSON.stringify(themes)}.includes(t)) {document.documentElement.setAttribute(${JSON.stringify(themeAttr)}, t)}})()`,
          }}
        />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
