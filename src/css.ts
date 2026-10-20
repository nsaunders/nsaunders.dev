import { createHooks, mergeStyles } from "@css-hooks/react";

export { mergeStyles };

export const { styleSheet, on, and, or, not } = createHooks(
  "@container (width >= 400px)",
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
  ".markdown > &:first-child",
  ".markdown > &:last-child",
  ".markdown blockquote > &:last-child",
  ".markdown li > &",
  ".markdown li + &",
  ".markdown p + &",
  ".markdown h2 + &",
  ".markdown h3 + &",
);

export const darkMode = or(
  and("@media (prefers-color-scheme: dark)", '[data-theme="auto"] &'),
  '[data-theme="dark"] &',
);

export const groupHover = and("@media (hover: hover)", ".group:hover &");
export const hover = and("@media (hover: hover)", "&:hover");
export const siblingHover = and("@media (hover: hover)", ":hover ~ &");
