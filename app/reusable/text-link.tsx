import type { ComponentPropsWithoutRef, ElementType } from "react";

import { Box } from "./box.js";
import { blue, gray, red } from "./colors.js";

export function TextLink<Is extends ElementType = "a">({
  is: isProp,
  ...props
}: { is?: Is } & Omit<ComponentPropsWithoutRef<Is>, "is">) {
  const is: ElementType = isProp || "a";
  return (
    <Box
      is={is}
      conditions={{
        darkHover: { and: ["hover", "dark"] },
        darkActive: { and: ["dark", "active"] },
      }}
      color={blue[70]}
      textDecorationThickness={1}
      textUnderlineOffset="0.125em"
      hover:color={blue[50]}
      active:color={red[50]}
      dark:color={blue[30]}
      darkHover:color={blue[20]}
      darkActive:color={red[20]}
      outlineWidth={0}
      outlineOffset={4}
      outlineColor={gray[30]}
      dark:outlineColor={gray[70]}
      outlineStyle="solid"
      focus:outlineWidth={2}
      {...props}
    />
  );
}
