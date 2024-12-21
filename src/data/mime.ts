const byExtension = {
  gif: "image/gif",
  html: "text/html",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain",
  webp: "image/webp",
} as const;

function fromExtension<E extends keyof typeof byExtension>(
  extension: E,
): (typeof byExtension)[E] {
  return byExtension[extension];
}

type Extension<Path> = Path extends `${infer _}.${infer P}`
  ? Extension<P>
  : Path;

export function fromPath<
  Path extends `${string}.${Parameters<typeof fromExtension>[0]}`,
>(path: Path): ReturnType<typeof fromExtension<Extension<Path>>> {
  const [extension] = /[a-z0-9]+$/.exec(path) as unknown as [Extension<Path>];
  return fromExtension(extension);
}

export const knownExtensions = Object.keys(byExtension).map(
  extension => `.${extension}`,
) as `.${keyof typeof byExtension}`[];
