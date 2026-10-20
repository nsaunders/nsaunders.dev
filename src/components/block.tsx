import type { ReactNode } from "react";

export function Block({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 1040,
        marginInline: "auto",
        paddingInline: 40,
      }}>
      {children}
    </div>
  );
}
