import { createRequire } from 'node:module';
import typography from '@tailwindcss/typography';
import daisyui from 'daisyui';

const require = createRequire(import.meta.url);
const themes = require("daisyui/src/theming/themes");

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {},
  },
  plugins: [
    typography,
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...themes["light"],
          primary: "teal",
        },
      },
      {
        dark: {
          ...themes["dark"],
          primary: "#00a090",
        },
      },
    ],
  },
}
