import type { ReactNode } from "react";

import { Box } from "./box.js";

export function Block({ children }: { children?: ReactNode }) {
  return (
    <Box width="calc(100dvw - 32px)" maxWidth={960} marginInline="auto">
      {children}
    </Box>
  );
}
