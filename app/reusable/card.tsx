import type { ReactNode } from "react";

import { Box } from "./box.js";
import { gray, white } from "./colors.js";

export function Card({
  children,
  importance = "primary",
}: {
  children?: ReactNode;
  importance?: "primary" | "secondary";
}) {
  return (
    <Box
      backgroundColor={importance === "primary" ? "#fff" : white}
      innerStrokeWidth={1}
      innerStrokeColor={gray(importance === "primary" ? 30 : 20)}
      dark:innerStrokeWidth={0}
      dark:backgroundColor={importance === "primary" ? gray(85) : gray(91)}
      padding={32}>
      {children}
    </Box>
  );
}
