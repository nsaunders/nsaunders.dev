import type { ReactNode } from "react";

export function Block({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        width: "calc(100dvw - 80px)",
        maxWidth: 960,
        marginInline: "auto",
      }}>
      {children}
    </div>
  );
}
