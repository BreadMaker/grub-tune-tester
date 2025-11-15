import { defineConfig } from "eslint/config";
import globals from "globals";
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

export default defineConfig([{
    extends: compat.extends("eslint:recommended"),

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.commonjs,
        },

        ecmaVersion: 12,
        sourceType: "script",
    },

    rules: {
        indent: ["error", 2],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single", {
            avoidEscape: true,
            allowTemplateLiterals: true
        }],
        semi: ["error", "always"],
    },
}]);