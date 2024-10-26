import type { ReactNode } from "react";
import { pipe } from "remeda";

import { gray, white } from "./colors.js";
import { darkMode, on } from "./css.js";

export function Card({
  children,
  importance = "primary",
}: {
  children?: ReactNode;
  importance?: "primary" | "secondary";
}) {
  return (
    <div
      style={pipe(
        {
          backgroundColor: importance === "primary" ? "#fff" : white,
          boxShadow: `0 0 0 1px ${gray(importance === "primary" ? 30 : 20)}`,
          padding: 32,
        },
        on(darkMode, {
          backgroundColor: importance === "primary" ? gray(85) : gray(91),
          boxShadow: "none",
        }),
      )}>
      {children}
    </div>
  );
}
