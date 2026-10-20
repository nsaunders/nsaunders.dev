import type { CSSProperties, MouseEvent, ReactElement, ReactNode } from "react";
import { cloneElement, useState } from "react";

import { darkMode, mergeStyles, on } from "../../../css.ts";
import { black, blue, gray, pink, white } from "../../../design/colors.ts";

const demoBlue = `light-dark(${blue(55)}, ${blue(30)})`;
const demoPink = `light-dark(${pink(55)}, ${pink(30)})`;

function Demo({
  children,
  label,
}: {
  children: ReactNode;
  label?: string | undefined;
}) {
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
      {label && <figcaption style={{ fontSize: 14 }}>{label}</figcaption>}
      <div
        style={{
          alignItems: "center",
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
        }}>
        {children}
      </div>
    </figure>
  );
}

function borderStyle(color: string): CSSProperties {
  return {
    border: `2px solid ${color}`,
    boxSizing: "border-box",
    display: "inline-block",
    padding: "8px 12px",
  };
}

function shadowStyle(color: string): CSSProperties {
  return mergeStyles(
    {
      background: white,
      boxShadow: `4px 4px 0 ${color}`,
      color: black,
      display: "inline-block",
      marginRight: 4,
      marginBottom: 4,
      padding: "8px 12px",
    },
    on(darkMode, {
      background: black,
      color: white,
    }),
  );
}

export function PropCollisionDemo({
  variant,
}: {
  variant: "separate" | "monochrome" | "two-tone";
}) {
  if (variant === "separate") {
    return (
      <Demo>
        <span style={shadowStyle(demoBlue)}>Shadow</span>
        <span style={borderStyle(demoBlue)}>Border</span>
      </Demo>
    );
  }

  const shadow = variant === "monochrome" ? demoBlue : demoPink;

  return (
    <Demo
      label={variant === "two-tone" ? "Desired two-tone output" : undefined}>
      <span style={{ ...shadowStyle(shadow), ...borderStyle(demoBlue) }}>
        Shadow + Border
      </span>
    </Demo>
  );
}

type AsChildForwardedProps = {
  disabled?: boolean | undefined;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  style: CSSProperties;
};

function AsChildButton({
  children,
  disabled,
}: {
  children: ReactElement;
  disabled?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const forwardedProps: AsChildForwardedProps = {
    disabled,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      background: hovered ? blue(40) : blue(50),
      borderRadius: 4,
      color: white,
      cursor: "pointer",
      display: "inline-block",
      opacity: disabled ? 0.6 : 1,
      padding: "12px 16px",
      textDecoration: "none",
    },
  };

  return cloneElement(
    children as ReactElement<Partial<AsChildForwardedProps>>,
    forwardedProps,
  );
}

function DemoLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <a
      href={href}
      onClick={preventDefault}
      style={mergeStyles(
        { color: blue(70) },
        on(darkMode, { color: blue(30) }),
      )}>
      {children}
    </a>
  );
}

export function NoContractDemo() {
  return (
    <Demo label="Custom Link drops Button style">
      <AsChildButton>
        <a href="#no-contract-demo" onClick={preventDefault}>
          Native &lt;a&gt; works
        </a>
      </AsChildButton>
      <AsChildButton>
        <DemoLink href="#no-contract-demo">Custom Link is broken</DemoLink>
      </AsChildButton>
    </Demo>
  );
}

function preventDefault(event: MouseEvent<HTMLAnchorElement>) {
  event.preventDefault();
}

type StyledProps = {
  children: ReactNode | ((props: { style: CSSProperties }) => ReactNode);
  style: CSSProperties;
};

function Styled({ children, style }: StyledProps) {
  return typeof children === "function" ? (
    children({ style })
  ) : (
    <span style={style}>{children}</span>
  );
}

function Shadow({ children }: Pick<StyledProps, "children">) {
  return <Styled style={shadowStyle(demoPink)}>{children}</Styled>;
}

function Border({ children }: Pick<StyledProps, "children">) {
  return <Styled style={borderStyle(demoBlue)}>{children}</Styled>;
}

function Text({ children }: Pick<StyledProps, "children">) {
  return <Styled style={{ fontSize: 20, fontWeight: 600 }}>{children}</Styled>;
}

export function CompositionDemo() {
  return (
    <Demo>
      <Shadow>
        {({ style: shadow, ...shadowRestProps }) => {
          shadowRestProps satisfies Record<PropertyKey, never>;
          return (
            <Border>
              {({ style: border, ...borderRestProps }) => {
                borderRestProps satisfies Record<PropertyKey, never>;
                return (
                  <Text>
                    {({ style: text, ...textRestProps }) => {
                      textRestProps satisfies Record<PropertyKey, never>;
                      return (
                        <button
                          style={{
                            ...shadow,
                            ...border,
                            ...text,
                          }}>
                          Composed button
                        </button>
                      );
                    }}
                  </Text>
                );
              }}
            </Border>
          );
        }}
      </Shadow>
    </Demo>
  );
}
