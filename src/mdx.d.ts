/* eslint @typescript-eslint/consistent-type-imports: 0 */

declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MDXContent: ComponentType<{
    components?: import("mdx/types").MDXComponents;
  }>;
  export default MDXContent;
}
