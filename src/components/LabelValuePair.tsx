import * as CSS from "csstype";

export type Props = {
  label: JSX.Node;
  value: JSX.Node;
  style?: CSS.Properties;
};

export default function LabelValuePair({ label, value, style }: Props) {
  return (
    <div style={{ display: "inline-flex", gap: "8px", ...style }}>
      <div style={{ display: "grid", placeItems: "center" }}>{label}</div>
      <div style={{ display: "grid", placeItems: "center" }}>{value}</div>
    </div>
  );
}
