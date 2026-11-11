import { createHooks, mergeStyles } from "@css-hooks/react";

export { mergeStyles };
export const { on, or, not, enable, disable, styleSheet } = createHooks(
  "&:not(:first-child)",
  "%dark",
  "%primary",
  "%secondary",
  "%tertiary",
);

export const invertDark = mergeStyles(
  on(not("%dark"), enable("%dark")),
  on("%dark", disable("%dark")),
);

type ColorFlag = "%primary" | "%secondary" | "%tertiary";

export function cycle(first: ColorFlag, ...rest: ColorFlag[]) {
  const flags = [first, ...rest];
  return flags.reduce(
    (style, flag, index) =>
      mergeStyles(
        style,
        on(flag, mergeStyles(disable(flag), enable(flags[index + 1] ?? first))),
      ),
    on(not(or(...flags)), enable(first)),
  );
}
