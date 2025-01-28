import puppeteer from "puppeteer";
import { renderToString } from "react-dom/server";
import * as v from "valibot";

import { Logo } from "../components/logo.tsx";
import { black, white } from "../design/colors.ts";
import type { Route } from "./+types/icon.ts";

export async function loader({ params }: Route.LoaderArgs) {
  const NumberParamSchema = v.pipe(
    v.string(),
    v.regex(/^[0-9]+$/),
    v.transform(parseInt),
  );

  const paramsParseResult = v.safeParse(
    v.object({
      width: NumberParamSchema,
      height: NumberParamSchema,
    }),
    params,
  );

  if (!paramsParseResult.success) {
    throw new Response(null, { status: 404 });
  }

  const { width, height } = paramsParseResult.output;

  const size = Math.min(Math.ceil(Math.min(width, height) * 0.75), 128);

  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });

  const page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.setContent(
    "<!DOCTYPE html>" +
      renderToString(
        <body
          style={{
            margin: 0,
            height: "100dvh",
            background: black,
            color: white,
            display: "grid",
            placeItems: "center",
          }}>
          <Logo size={size} />
        </body>,
      ),
  );

  const image = await page.screenshot({ type: "png" });

  await browser.close();

  return new Response(image, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
}
