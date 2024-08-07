function base(chroma: number, hue: number) {
  return function (
    shade:
      | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
      | `${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}${
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6
          | 7
          | 8
          | 9
          | 0}` extends `${infer Shade extends number}`
      ? Shade
      : never,
  ) {
    return `oklch(${109.9 - 1.069 * shade}% ${chroma} ${hue})`;
  };
}

export const gray = base(0.01, 260);
export const blue = base(0.18, 260);
export const green = base(0.16, 160);
export const yellow = base(0.16, 90);
export const red = base(0.16, 25);
export const black = "oklch(9.5% 0.01 260)";
export const white = "oklch(100% 0.01 260)";
