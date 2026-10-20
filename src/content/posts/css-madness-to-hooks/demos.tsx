import { darkMode, mergeStyles, on } from "../../../css.ts";
import { gray } from "../../../design/colors.ts";

export function CssHooksDemo() {
  return (
    <figure
      style={mergeStyles(
        {
          background: gray(15),
          colorScheme: "light",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          margin: "24px 0",
          padding: 24,
        },
        on(darkMode, { background: gray(85), colorScheme: "dark" }),
      )}>
      <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
        <button
          type="button"
          style={mergeStyles(
            {
              background: "#666",
              border: 0,
              borderRadius: 4,
              color: "white",
              cursor: "pointer",
              font: "inherit",
              padding: "12px 16px",
            },
            on(darkMode, { background: "#333" }),
            on("&:hover", {
              background: "#009",
            }),
            on("&:active", {
              background: "#900",
              transform: "scale(0.98)",
            }),
          )}>
          Save changes
        </button>
      </div>
    </figure>
  );
}
