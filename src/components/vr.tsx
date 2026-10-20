import type { ComponentPropsWithoutRef } from "react";

import { darkMode, mergeStyles, on } from "../css.ts";
import { gray } from "../design/colors.ts";

export function Vr({ style, ...restProps }: ComponentPropsWithoutRef<"hr">) {
  return (
    <hr
      style={mergeStyles(
        {
          width: 1,
          height: "100%",
          margin: 0,
          borderWidth: 0,
          backgroundColor: gray(20),
        },
        on(darkMode, {
          backgroundColor: gray(80),
        }),
        style,
      )}
      {...restProps}
    />
  );
}
