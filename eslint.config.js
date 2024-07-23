// @ts-check

import eslint from "@eslint/js";
// @ts-expect-error eslint-plugin-import does indeed have a default export
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importSortPlugin from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["**/build/**"],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
    languageOptions: {
      globals: {
        process: "readonly",
      },
    },
  },
  {
    files: ["./vite.config.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  {
    plugins: {
      import: importPlugin,
      "simple-import-sort": importSortPlugin,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", disallowTypeAnnotations: true },
      ],
      "import/consistent-type-specifier-style": "error",
      "import/extensions": ["error", "ignorePackages"],
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-absolute-path": "error",
      "import/no-amd": "error",
      "import/no-default-export": "error",
      "import/no-duplicates": "error",
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          peerDependencies: true,
          optionalDependencies: false,
        },
      ],
      "import/no-mutable-exports": "error",
      "import/no-named-default": "error",
      "import/no-named-export": "off", // we want everything to be a named export
      "import/no-self-import": "error",
      "import/prefer-default-export": "off", // we want everything to be named
      "simple-import-sort/imports": "error",
    },
  },
  {
    files: ["app/**/*.tsx"],
    ...reactPlugin.configs.flat.recommended,
    rules: {
      ...reactPlugin.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
      formComponents: ["Form"],
      linkComponents: [
        { name: "Link", linkAttribute: "to" },
        { name: "NavLink", linkAttribute: "to" },
      ],
    },
  },
  {
    files: ["app/**/*.tsx"],
    ...jsxA11y.flatConfigs.recommended,
  },
  {
    files: ["app/**/*.tsx"],
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    // @ts-expect-error plugin types incorrectly inferred
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
);
