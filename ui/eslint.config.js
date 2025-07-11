import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
	{ ignores: ["dist"] },
	{
		extends: [js.configs.recommended, ...tseslint.configs.recommended],
		files: ["**/*.{ts,tsx}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			"@typescript-eslint/no-namespace": "off",
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
		},
	},
	{
		...eslintPluginPrettierRecommended,
		rules: {
			"prettier/prettier": [
				"error",
				{
					tabWidth: 2,
					useTabs: true,
					printWidth: 80,
				},
			],
		},
	},
);
