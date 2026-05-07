import { defineConfig, globalIgnores } from "eslint/config";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import jest from "eslint-plugin-jest";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([globalIgnores(["**/node_modules", "**/.next"]), {
    extends: fixupConfigRules(compat.extends(
        
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:jsx-a11y/recommended",
        "plugin:jest/recommended",
        "plugin:prettier/recommended",
        "prettier",
    )),

    plugins: {
        react: fixupPluginRules(react),
        "react-hooks": fixupPluginRules(reactHooks),
        "@typescript-eslint": fixupPluginRules(typescriptEslint),
        jest: fixupPluginRules(jest),
        prettier: fixupPluginRules(prettier),
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
            ...globals.node,
            ...globals.jest,
        },

        parser: tsParser,
        ecmaVersion: 2018,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },

            project: "./tsconfig.json",
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "react/react-in-jsx-scope": "off",

        "react/jsx-props-no-spreading": ["error", {
            custom: "ignore",
        }],

        "import/no-named-as-default": 0,
        "no-console": 0,

        "@typescript-eslint/naming-convention": ["error", {
            selector: "variable",
            format: ["camelCase", "PascalCase", "UPPER_CASE", "snake_case"],
        }],

        "@typescript-eslint/ban-ts-comment": ["error", {
            "ts-ignore": "allow-with-description",
        }],
    },
}]);