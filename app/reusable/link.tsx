import * as Remix from "@remix-run/react";
import type { ComponentPropsWithRef } from "react";

export function Link(
  props: Omit<ComponentPropsWithRef<typeof Remix.Link>, "reloadDocument">,
) {
  return <Remix.Link {...props} reloadDocument />;
}
