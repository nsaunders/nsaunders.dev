import type { ReactNode } from "react";

import { darkMode, on as onTheme } from "../../../css.ts";
import { gray } from "../../../design/colors.ts";
import {
  cycle,
  disable,
  invertDark,
  mergeStyles,
  on,
  styleSheet,
} from "./css.ts";

function ThemePanel({ children }: { children?: ReactNode }) {
  return (
    <div
      style={mergeStyles(
        { background: "#fff", color: "#222", padding: 20 },
        invertDark,
        on("%dark", { background: "#333", color: "#fff" }),
        on("&:not(:first-child)", { marginTop: 20 }),
      )}>
      <span>Panel</span>
      {children}
    </div>
  );
}

export function ThemeInversionDemo() {
  return (
    <figure
      aria-label="Nested panels alternate between dark and light themes"
      style={mergeStyles(
        { background: gray(15), margin: "24px 0", padding: 20 },
        onTheme(darkMode, { background: gray(85) }),
        disable("%dark"),
      )}>
      <ThemePanel>
        <ThemePanel>
          <ThemePanel />
        </ThemePanel>
      </ThemePanel>
      <style>{styleSheet()}</style>
    </figure>
  );
}

function ColorPanel({ children }: { children?: ReactNode }) {
  return (
    <div
      style={mergeStyles(
        {
          color: "white",
          padding: 20,
          boxShadow: "inset 0 0 0 1px #03010580, 0 0 0 1px #03010580",
        },
        on("%primary", { background: "#885bc0" }),
        on("%secondary", { background: "#406dde" }),
        on("%tertiary", { background: "#b64096" }),
        cycle("%primary", "%secondary", "%tertiary"),
        on("&:not(:first-child)", { marginTop: 20 }),
      )}>
      <span>Panel</span>
      {children}
    </div>
  );
}

export function ColorCycleDemo() {
  return (
    <figure
      aria-label="Nested panels cycle through purple, blue, pink, and purple"
      style={mergeStyles(
        { background: gray(15), margin: "24px 0", padding: 20 },
        onTheme(darkMode, { background: gray(85) }),
        disable("%primary", "%secondary", "%tertiary"),
      )}>
      <ColorPanel>
        <ColorPanel>
          <ColorPanel>
            <ColorPanel />
          </ColorPanel>
        </ColorPanel>
      </ColorPanel>
      <style>{styleSheet()}</style>
    </figure>
  );
}
