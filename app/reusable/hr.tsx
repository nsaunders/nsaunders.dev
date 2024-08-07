import { Box } from "./box.js";
import { gray } from "./colors.js";

export function Hr() {
  return (
    <Box
      as="hr"
      height={1}
      borderWidth={0}
      backgroundColor={gray(20)}
      dark:backgroundColor={gray(80)}
    />
  );
}
