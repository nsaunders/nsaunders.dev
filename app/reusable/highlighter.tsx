import { createHighlighter } from "shiki";

export const highlighter = async () =>
  await createHighlighter({
    langs: ["css", "html", "javascript", "json", "jsx", "typescript", "tsx"],
    themes: ["github-dark", "github-light"],
  });
