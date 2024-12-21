export function removePrefix<From extends string, Prefix extends string>(
  from: From,
  prefix: Prefix,
) {
  return (
    from.startsWith(prefix) ? from.substring(prefix.length) : from
  ) as From extends `${Prefix}${infer Rest}` ? Rest : From;
}

export function startsWith<const Prefix extends string | string[]>(
  s: string,
  prefixes: Prefix,
): s is `${Prefix extends string ? Prefix : Prefix[number]}${string}` {
  return (prefixes instanceof Array ? prefixes : [prefixes]).some(prefix =>
    s.startsWith(prefix),
  );
}

export function endsWith<const Suffix extends string | string[]>(
  s: string,
  suffixes: Suffix,
): s is `${string}${Suffix extends string ? Suffix : Suffix[number]}` {
  return (suffixes instanceof Array ? suffixes : [suffixes]).some(suffix =>
    s.endsWith(suffix),
  );
}
