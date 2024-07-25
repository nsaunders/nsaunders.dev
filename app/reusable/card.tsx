import type { ReactNode } from "react";

import { Box } from "./box.js";
import { gray, white } from "./colors.js";

export function Card({ children }: { children?: ReactNode }) {
  return (
    <Box
      backgroundColor={white}
      borderWidth={1}
      borderStyle="solid"
      borderColor={gray[20]}
      dark:borderWidth={0}
      dark:backgroundColor={gray[85]}
      padding={32}>
      {children}
    </Box>
  );
}
