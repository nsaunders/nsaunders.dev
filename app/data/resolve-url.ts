export function resolveURL(basePath: string, relativeOrAbsoluteURL: string) {
  const dummyOrigin = "http://dummy";

  try {
    return new URL(relativeOrAbsoluteURL).href;
  } catch (e) {
    const baseURL = new URL(basePath, dummyOrigin);
    return new URL(relativeOrAbsoluteURL, baseURL).pathname;
  }
}
