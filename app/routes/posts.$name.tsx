import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import * as Posts from "~/data/posts.js";

export async function loader({ params }: LoaderFunctionArgs) {
  const post = params.name ? await Posts.getByName(params.name) : undefined;
  if (!post) {
    throw new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  return json(post);
}

export default function Post() {
  const post = useLoaderData<typeof loader>();
  return (
    <>
      <h1>Post {post.name}</h1>
      <p>{post.markdown}</p>
    </>
  );
}
