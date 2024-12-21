import { black, white } from "../design/colors.ts";

export function loader() {
  return new Response(
    JSON.stringify({
      short_name: "nsaunders.dev",
      name: "Nick Saunders — nsaunders.dev",
      icons: [
        {
          src: "/icons/192/192/icon.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/icons/512/512/icon.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      start_url: ".",
      display: "standalone",
      background_color: black,
      theme_color: white,
    }),
    {
      headers: {
        "Content-Type": "applicatin/json",
      },
    },
  );
}
