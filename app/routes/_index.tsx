import type { MetaFunction } from "@remix-run/react";

import { Box } from "~/reusable/box.js";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export default function Index() {
  return (
    <div className="font-sans p-4">
      <Box is="h1" className="text-3xl" style={{ fontSize: 25 }}>
        Welcome to Remix on Cloudflare
      </Box>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer">
            Remix Docs
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer">
            Cloudflare Pages Docs - Remix guide
          </a>
        </li>
      </ul>
    </div>
  );
}
