import { defineConfig } from 'astro/config';
import remarkToc from 'remark-toc';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import customRemarkPlugin from './src/remark/customRemarkPlugin';

import partytown from '@astrojs/partytown';

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
  integrations: [
    tailwind(),
    mdx(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    })
  ],
  markdown: {
    remarkPlugins: [remarkToc, customRemarkPlugin]
  },
});
