import tseslint from "typescript-eslint";
import hooks from "eslint-plugin-react-hooks";
import a11y from "eslint-plugin-jsx-a11y";
export default tseslint.config(
  { ignores: [".next/**", "coverage/**", "playwright-report/**", "test-results/**"] },
  ...tseslint.configs.recommended,
  { files: ["src/**/*.{ts,tsx}", "e2e/**/*.ts"], plugins: { "react-hooks": hooks, "jsx-a11y": a11y },
    languageOptions: { parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: { ...hooks.configs.recommended.rules, ...a11y.configs.recommended.rules } }
);
