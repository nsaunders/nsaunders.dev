import { pipe } from "remeda";
import { component, hr } from "renuel";

import { darkMode, on } from "../css.ts";
import { gray } from "../design/colors.ts";

export const { Hr, Hr$ } = component("Hr", () =>
  hr({
    style: pipe(
      {
        margin: 0,
        height: 1,
        borderWidth: 0,
        backgroundColor: gray(20),
      },
      on(darkMode, {
        backgroundColor: gray(80),
      }),
    ),
  }),
);
