import type { MetaDescriptor } from "@remix-run/node";

export function og({
  image = "/opengraph.png",
  url = "",
}: {
  image?: string;
  url: string;
}): MetaDescriptor[] {
  return [
    {
      property: "og:image",
      content: `https://nsaunders.dev${image}`,
    },
    {
      property: "og:url",
      content: `https://nsaunders.dev${url}`,
    },
    {
      property: "og:site_name",
      content: "nsaunders.dev",
    },
    {
      property: "twitter:creator",
      content: "agilecoder",
    },
    {
      property: "twitter:card",
      content: "summary_large_image",
    },
  ];
}
