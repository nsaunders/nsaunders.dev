import { Box } from "./box.js";
import { gray } from "./colors.js";

export function Vr() {
  return (
    <Box
      is="hr"
      width={1}
      height="100%"
      borderWidth={0}
      backgroundColor={gray(20)}
      dark:backgroundColor={gray(80)}
    />
  );
}
