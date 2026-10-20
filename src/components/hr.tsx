import { darkMode, mergeStyles, on } from "../css.ts";
import { gray } from "../design/colors.ts";

export function Hr() {
  return (
    <hr
      style={mergeStyles(
        {
          margin: 0,
          height: 1,
          borderWidth: 0,
          backgroundColor: gray(20),
        },
        on(darkMode, {
          backgroundColor: gray(80),
        }),
      )}
    />
  );
}
