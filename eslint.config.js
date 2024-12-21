// @ts-check

import eslint from "@eslint/js";
// @ts-expect-error eslint-plugin-import does indeed have a default export
import importPlugin from "eslint-plugin-import";
import importSortPlugin from "eslint-plugin-simple-import-sort";
import unusedImportPlugin from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["build/**", ".react-router/**"],
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
    plugins: {
      import: importPlugin,
      "simple-import-sort": importSortPlugin,
      "unused-imports": unusedImportPlugin,
    },
    rules: {
      "no-unexpected-multiline": "off",
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
      "import/no-default-export": "off",
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
      "simple-import-sort/imports": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "error",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
);
