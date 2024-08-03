import type { LoaderFunctionArgs } from "@remix-run/node";
import mime from "mime";
import sharp from "sharp";

function outputFormat(mimeType: string) {
  switch (mimeType) {
    case "image/gif":
      return "gif";
    case "image/jpeg":
      return "jpeg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      throw new Error(`Unsupported image format ${mimeType}`);
  }
}

export async function loader({ params, request: { url } }: LoaderFunctionArgs) {
  const { protocol, host } = new URL(url);
  const dimensionMatch = params.dimension?.match(
    /^([1-9][0-9]*)x([1-9][0-9]*)$/,
  );
  if (!dimensionMatch) {
    throw new Response("No dimension specified", {
      status: 404,
      statusText: "Not Found",
    });
  }
  if (!params["*"]) {
    throw new Response("No image path specified", {
      status: 404,
      statusText: "Not Found",
    });
  }
  const imageRes = await fetch(`${protocol}//${host}/${params["*"]}`);
  if (!imageRes.ok) {
    throw new Response(
      `Upstream image request failed with a status of ${imageRes.status} ${imageRes.statusText}.`,
    );
  }
  const mimeType = mime.getType(params["*"]);
  if (!mimeType) {
    throw new Response(`Unable to resolve MIME type for path ${params["*"]}`, {
      status: 406,
      statusText: "Not Acceptable",
    });
  }
  return new Response(
    await sharp(await imageRes.arrayBuffer())
      .resize({
        width: parseInt(dimensionMatch[1]),
        height: parseInt(dimensionMatch[2]),
        fit: "cover",
      })
      [outputFormat(mimeType)]()
      .toBuffer(),
    {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "max-age=3600, public",
      },
    },
  );
}
