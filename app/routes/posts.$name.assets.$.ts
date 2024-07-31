import type { LoaderFunctionArgs } from "@remix-run/node";
import mime from "mime";

import * as GH from "~/data/github.js";

export async function loader({ params }: LoaderFunctionArgs) {
  if (!params.name) {
    throw new Response('Missing "name" parameter', {
      status: 404,
      statusText: "Not Found",
    });
  }
  if (!params["*"]) {
    throw new Response('Missing "*" parameter', {
      status: 404,
      statusText: "Not Found",
    });
  }
  const mediaRes = await fetch(
    `https://media.githubusercontent.com/media/nsaunders/writing/master/posts/${params.name}/assets/${params["*"]}`,
    GH.configureRequest({}),
  );
  if (mediaRes.ok) {
    return new Response(await mediaRes.blob(), {
      headers: {
        "Content-Type":
          mime.getType(mediaRes.url) || "application/octet-stream",
      },
    });
  }
  const textRes = await fetch(
    `https://raw.githubusercontent.com/nsaunders/writing/master/posts/${params.name}/assets/${params["*"]}`,
    GH.configureRequest({}),
  );
  return new Response(await textRes.text(), {
    headers: {
      "Content-Type": mime.getType(textRes.url) || "text/plain",
    },
  });
}
