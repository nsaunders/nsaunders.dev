import type { ReactNode } from "react";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export function ClientOnly({ children }: { children?: ReactNode }) {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  ) ? (
    <>{children}</>
  ) : null;
}
