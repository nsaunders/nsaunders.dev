import type {
  LoaderFunction,
  MetaFunction,
  SerializeFrom,
} from "@remix-run/node";

export const createMeta =
  <Loader>(
    create: (
      data: Loader extends LoaderFunction ? SerializeFrom<Loader> : unknown,
    ) => {
      title: string;
      description: string;
      image?: string;
    },
  ): MetaFunction<Loader> =>
  ({ location: { pathname }, data }) => {
    const {
      title,
      description,
      image = "/opengraph.png",
    } = create(data as Parameters<typeof create>[0]);
    return [
      { title },
      { name: "description", content: description },
      {
        property: "og:title",
        content: title,
      },
      {
        property: "og:description",
        content: description,
      },
      {
        property: "og:image",
        content: `https://nsaunders.dev${image}`,
      },
      {
        property: "og:url",
        content: `https://nsaunders.dev${pathname}`,
      },
      {
        property: "og:site_name",
        content: "nsaunders.dev",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        name: "twitter:creator",
        content: "agilecoder",
      },
      {
        name: "twitter:title",
        conntent: title,
      },
      {
        name: "twitter:description",
        content: description,
      },
      {
        name: "twitter:image",
        content: `https://nsaunders.dev${image}`,
      },
    ];
  };
