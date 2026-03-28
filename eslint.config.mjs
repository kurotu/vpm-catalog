import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'vpm/**', '.astro/**'],
  },
  ...eslintPluginAstro.configs['flat/recommended'],
  {
    files: ['**/*.ts'],
    extends: tseslint.configs.recommended,
  },
);
