import type { ReactNode } from "react";
import { component, div } from "renuel";

export const { ScreenReaderOnly, ScreenReaderOnly$ } = component(
  "ScreenReaderOnly",
  ({ children }: { children?: ReactNode }) =>
    div(
      {
        style: {
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflowX: "hidden",
          overflowY: "hidden",
          clip: "rect(0,0,0,0)",
          borderWidth: 0,
        },
      },
      children,
    ),
);
