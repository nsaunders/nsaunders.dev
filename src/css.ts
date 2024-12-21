import { createHooks } from "@css-hooks/react";
import type { CSSProperties } from "react";

export const { styleSheet, on, and, or, not } = createHooks(
  "@container (min-width: 640px)",
  "@media (prefers-color-scheme: dark)",
  "@media (hover: hover)",
  '[data-theme="auto"] &',
  '[data-theme="dark"] &',
  "&:active",
  "&:focus-visible",
  "&:hover",
  "&.active",
  ".group:hover &",
  ":hover ~ &",
  ":active ~ &",
);

export function merge(b: CSSProperties | undefined) {
  return (a: CSSProperties) => {
    if (!b) {
      return a;
    }
    const style = JSON.parse(JSON.stringify(a)) as CSSProperties;
    for (const key in b) {
      const property = key as keyof CSSProperties;
      delete style[property];
      Object.assign(style, { [property]: b[property] });
    }
    return style;
  };
}

export const darkMode = or(
  and("@media (prefers-color-scheme: dark)", '[data-theme="auto"] &'),
  '[data-theme="dark"] &',
);

export const groupHover = and("@media (hover: hover)", ".group:hover &");
export const hover = and("@media (hover: hover)", "&:hover");
export const siblingHover = and("@media (hover: hover)", ":hover ~ &");
