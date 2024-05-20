import { defineConfig } from 'astro/config';
import remarkToc from 'remark-toc';
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkToc],
  },
});
