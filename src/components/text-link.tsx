import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
} from "react";
import { pipe } from "remeda";

import { and, darkMode, hover, merge, on } from "../css.ts";
import { blue, gray, red } from "../design/colors.ts";

export function TextLink<As extends ElementType = "a">({
  as,
  style,
  ...restProps
}: { as?: As } & Omit<ComponentPropsWithoutRef<As>, "as">) {
  const Component: ElementType<{ style: CSSProperties }> = as || "a";
  return (
    <Component
      style={pipe(
        {
          color: blue(70),
          textDecorationThickness: 1,
          textUnderlineOffset: "0.125em",
          outlineWidth: 0,
          outlineStyle: "solid",
          outlineOffset: 4,
          outlineColor: gray(30),
        },
        on(hover, {
          color: blue(50),
        }),
        on("&:active", {
          color: red(50),
        }),
        on(darkMode, {
          color: blue(30),
          outlineColor: gray(70),
        }),
        on(and(darkMode, hover), {
          color: blue(20),
        }),
        on(and(darkMode, "&:active"), {
          color: red(20),
        }),
        on("&:focus-visible", {
          outlineWidth: 2,
        }),
        merge(style),
      )}
      {...restProps}
    />
  );
}
