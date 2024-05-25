import { defineConfig } from 'astro/config';
import remarkToc from 'remark-toc';
import tailwind from "@astrojs/tailwind";

let site = process.env['VERCEL'] ? `https://${process.env['VERCEL_PROJECT_PRODUCTION_URL']}` : undefined;

// https://astro.build/config
export default defineConfig({
  site: site,
  integrations: [tailwind()],
  markdown: {
    remarkPlugins: [remarkToc],
  },
});
