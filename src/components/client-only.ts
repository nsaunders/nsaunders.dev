import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";
import { component } from "renuel";

const emptySubscribe = () => () => {};

export const { ClientOnly, ClientOnly$ } = component(
  "ClientOnly",
  ({ children }: { children: ReactNode }) =>
    useSyncExternalStore(
      emptySubscribe,
      () => true,
      () => false,
    )
      ? children
      : null,
);
