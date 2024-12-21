import type { MetaDescriptors } from "react-router/route-module";

const url = (pathname: string) =>
  URL.parse(pathname, process.env.APP_URL)?.toString();

type CreateMetaDescriptorArgs = {
  title: string;
  description: string;
  image?: string | undefined;
};

export const createMetaDescriptors =
  <Args extends { location: { pathname: string } }>(
    argsIn:
      | CreateMetaDescriptorArgs
      | ((args: Args) => CreateMetaDescriptorArgs),
  ): ((args: Args) => MetaDescriptors) =>
  (args: Args) => {
    const defaultImage = "/icons/1200/630/icon.png";
    const {
      location: { pathname },
    } = args;
    const go = ({
      title,
      description,
      image,
    }: CreateMetaDescriptorArgs): MetaDescriptors => [
      { title: `${title} — nsaunders.dev` },
      { property: "og:title", content: title },
      { property: "og:image", content: url(image || defaultImage) },
      { property: "og:url", content: url(pathname) },
      { property: "og:site_name", content: "nsaunders.dev" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: url(image || defaultImage) },
      { name: "twitter:creator", content: "agilecoder" },
      { name: "twitter:title", content: title },
      { name: "description", content: description },
    ];
    return typeof argsIn === "function" ? go(argsIn(args)) : go(argsIn);
  };
