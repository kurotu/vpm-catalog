import { defineConfig } from 'astro/config';
import remarkToc from 'remark-toc';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import vercel from '@astrojs/vercel/static';
import customRemarkPlugin from './src/remark/customRemarkPlugin';

export const site = process.env['VERCEL'] ? `https://${process.env['VERCEL_PROJECT_PRODUCTION_URL']}` : undefined;

// https://astro.build/config
export default defineConfig({
  site: site,
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    fallback: {
      ja: 'en',
    },
    routing: {
      fallbackType: 'rewrite',
    }
  },
  integrations: [tailwind(), mdx()],
  markdown: {
    remarkPlugins: [remarkToc, customRemarkPlugin]
  },
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
});
