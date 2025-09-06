import type { ReactNode } from "react";
import { component, div } from "renuel";

export const { Block, Block$, _Block, _Block$ } = component(
  "Block",
  ({ children }: { children?: ReactNode }) =>
    div(
      {
        style: {
          width: "calc(100dvw - 80px)",
          maxWidth: 960,
          marginInline: "auto",
        },
      },
      children,
    ),
);
