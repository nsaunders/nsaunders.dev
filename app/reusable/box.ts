import {
  createComponent,
  createConditions,
  createHooks,
  createStyleProps,
} from "@embellish/react";
import type {} from "csstype";
import type { CSSProperties, CSSProperties as CSSPropertiesBase } from "react";

declare module "react" {
  interface CSSProperties {
    "--box-shadow"?: CSSPropertiesBase["boxShadow"];
    "--inner-stroke-color"?: CSSPropertiesBase["color"];
    "--inner-stroke-width"?: number;
    "--line-height"?: number;
    "--outer-stroke-color"?: CSSPropertiesBase["color"];
    "--outer-stroke-width"?: number;
  }
}

const { StyleSheet, hooks } = createHooks([
  "@container (min-width: 640px)",
  "@media (prefers-color-scheme: dark)",
  "&:active",
  "&:focus-visible",
  "&:hover",
  "&.active",
]);

export { StyleSheet };

function parseLengths(
  [char, ...str]: string,
  values: string[] = [],
  acc = "",
): string[] {
  if (!char) {
    return values.concat(acc);
  }
  if (/\s/.test(char)) {
    const balanced =
      (acc.match(/\(/) || []).length === (acc.match(/\)/) || []).length;
    return balanced
      ? parseLengths(str.join(""), [...values, acc], "")
      : parseLengths(str.join(""), values, `${acc}${char}`);
  }
  return parseLengths(str.join(""), values, `${acc}${char}`);
}

function createStartEndShorthand<P extends keyof CSSProperties>(
  property: P,
  parseShorthand: (shorthand: string) => string[],
  longhandPropertyName: (startEnd: "Start" | "End") => keyof CSSProperties,
) {
  return (value: CSSProperties[P]): CSSProperties => {
    if (typeof value !== "string") {
      return { [property]: value };
    }
    const values = parseShorthand(value);
    return {
      [longhandPropertyName("Start")]: values[0],
      [longhandPropertyName("End")]: values[1] || values[0],
    };
  };
}

function createTRBLShorthand<P extends keyof CSSProperties>(
  property: P,
  parseShorthand: (shorthand: string) => string[],
  longhandPropertyName: (
    trbl: "Top" | "Right" | "Bottom" | "Left",
  ) => keyof CSSProperties,
) {
  return (value: CSSProperties[P]): CSSProperties => {
    if (typeof value !== "string") {
      return { [property]: value };
    }
    const values = parseShorthand(value);
    return {
      [longhandPropertyName("Top")]: values[0],
      [longhandPropertyName("Right")]: values[1] || values[0],
      [longhandPropertyName("Bottom")]: values[2] || values[0],
      [longhandPropertyName("Left")]: values[3] || values[1] || values[0],
    };
  };
}

export const Box = createComponent({
  displayName: "Box",
  defaultIs: "div",
  defaultStyle: is => {
    const style: CSSProperties = {
      boxShadow:
        "var(--box-shadow, 0 0), 0 0 0 calc(var(--outer-stroke-width, 0) * 1px) var(--outer-stroke-color, transparent), inset 0 0 0 calc(var(--inner-stroke-width, 0) * 1px) var(--inner-stroke-color, transparent)",
      boxSizing: "border-box",
      margin: 0,
      lineHeight: "round(up, calc(var(--line-height, 1.5) * 1em), 4px)",
    };

    if (
      is === "img" ||
      is === "picture" ||
      is === "video" ||
      is === "canvas" ||
      is === "svg"
    ) {
      style.display = "block";
      style.maxWidth = "100%";
    } else if (
      is === "input" ||
      is === "button" ||
      is === "textarea" ||
      is === "select"
    ) {
      style.font = "inherit";
    } else if (is === "p" || (typeof is === "string" && /^h[1-6]$/.test(is))) {
      style.overflowWrap = "break-word";
    }

    return style;
  },
  conditions: createConditions(hooks, {
    active: "&:active",
    activeUnselected: { and: ["&:active", { not: "&.active" }] },
    containerLarge: "@container (min-width: 640px)",
    dark: "@media (prefers-color-scheme: dark)",
    focus: "&:focus-visible",
    hover: "&:hover",
    hoverUnselected: { and: ["&:hover", { not: "&.active" }] },
    selected: "&.active",
  }),
  styleProps: createStyleProps({
    alignItems: true,
    alignSelf: true,
    backgroundColor: true,
    borderColor: true,
    borderInlineStartWidth: true,
    borderRadius: true,
    borderStyle: true,
    borderWidth: true,
    boxShadow: (value: CSSProperties["boxShadow"]) => ({
      "--box-shadow": value,
    }),
    color: true,
    containerType: true,
    display: true,
    flexBasis: true,
    flexDirection: true,
    flexGrow: true,
    flexWrap: true,
    fontFamily: true,
    fontSize: true,
    fontWeight: true,
    gap: true,
    gridTemplateColumns: true,
    height: true,
    innerStrokeColor: (value: CSSProperties["color"]) => ({
      "--inner-stroke-color": value,
    }),
    innerStrokeWidth: (value: number) => ({
      "--inner-stroke-width": value,
    }),
    justifyContent: true,
    letterSpacing: true,
    lineHeight: (value: CSSProperties["lineHeight"]) =>
      typeof value === "number"
        ? ({
            "--line-height": value,
          } satisfies CSSProperties)
        : {
            lineHeight: value,
          },
    listStyleType: true,
    margin: createTRBLShorthand("margin", parseLengths, x => `margin${x}`),
    marginBlock: true,
    marginBottom: true,
    marginInline: true,
    marginLeft: true,
    marginRight: true,
    marginTop: true,
    maxHeight: true,
    maxWidth: true,
    minHeight: true,
    minWidth: true,
    outerStrokeColor: (value: CSSProperties["color"]) => ({
      "--outer-stroke-color": value,
    }),
    outerStrokeWidth: (value: number) => ({
      "--outer-stroke-width": value,
    }),
    outlineColor: true,
    outlineOffset: true,
    outlineStyle: true,
    outlineWidth: true,
    overflowX: true,
    overflowY: true,
    padding: createTRBLShorthand("padding", parseLengths, x => `padding${x}`),
    paddingBlock: createStartEndShorthand(
      "paddingBlock",
      parseLengths,
      x => `paddingBlock${x}`,
    ),
    paddingInline: createStartEndShorthand(
      "paddingInline",
      parseLengths,
      x => `paddingInline${x}`,
    ),
    textDecorationColor: true,
    textDecorationLine: true,
    textDecorationThickness: true,
    textUnderlineOffset: true,
    width: true,
  }),
});
