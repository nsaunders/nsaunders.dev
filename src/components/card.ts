import type { ReactNode } from "react";
import { pipe } from "remeda";
import { component, div } from "renuel";

import { darkMode, on } from "../css.ts";
import { gray, white } from "../design/colors.ts";

export const { Card, Card$ } = component(
  "Card",
  ({
    children,
    importance = "primary",
  }: {
    children?: ReactNode;
    importance?: "primary" | "secondary";
  }) =>
    div(
      {
        style: pipe(
          {
            backgroundColor: importance === "primary" ? "#fff" : white,
            boxShadow: `0 0 0 1px ${gray(importance === "primary" ? 30 : 20)}`,
            padding: 32,
          },
          on(darkMode, {
            backgroundColor: importance === "primary" ? gray(85) : gray(91),
            boxShadow: "none",
          }),
        ),
      },
      children,
    ),
);
