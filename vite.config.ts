import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    define: Object.fromEntries(
      Object.entries(env)
        .filter(([key]) => key.startsWith("VITE_"))
        .map(([key, value]) => [`process.env.${key}`, JSON.stringify(value)]),
    ),
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
      tsconfigPaths(),
    ],
  };
});
