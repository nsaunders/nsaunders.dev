import type { ComponentPropsWithoutRef } from "react";
import { pipe } from "remeda";

import { gray } from "./colors.js";
import { darkMode, merge, on } from "./css.js";

export function Vr({ style, ...restProps }: ComponentPropsWithoutRef<"hr">) {
  return (
    <hr
      style={pipe(
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
        merge(style),
      )}
      {...restProps}
    />
  );
}
