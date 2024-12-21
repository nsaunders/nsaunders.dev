import type { ComponentPropsWithoutRef } from "react";
import { pipe } from "remeda";

import { darkMode, merge, on } from "../css.ts";
import { gray } from "../design/colors.ts";

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
