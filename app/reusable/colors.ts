function base(chroma: number, hue: number) {
  return new Proxy(
    {},
    {
      get(_, key) {
        const shade = typeof key === "string" ? parseInt(key) : 50;
        return `oklch(${109.9 - 1.069 * shade}% ${chroma} ${hue})`;
      },
    },
  ) as {
    [Shade in
      | `0${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
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
          | 0}`]: string;
  };
}

export const gray = base(0.01, 260);
export const blue = base(0.18, 260);
export const green = base(0.16, 160);
export const yellow = base(0.16, 90);
export const red = base(0.16, 25);
export const black = "oklch(9.5% 0.01 260)";
export const white = "oklch(100% 0.01 260)";