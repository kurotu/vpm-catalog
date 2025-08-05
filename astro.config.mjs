import { defineConfig } from 'astro/config';
import remarkToc from 'remark-toc';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import customRemarkPlugin from './src/remark/customRemarkPlugin';

import partytown from '@astrojs/partytown';
import rehypeExternalLinks from 'rehype-external-links';

export const site = process.env['VERCEL'] ? `https://${process.env['VERCEL_PROJECT_PRODUCTION_URL']}` : undefined;

// https://astro.build/config
export default defineConfig({
  site: site,
  vite:{
    build: {
      rollupOptions: {
        external: [
          "fsevents"
        ]
      }
    }
  },
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
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          ja: 'ja-JP',
        }
      },
    }),
    mdx(),
    partytown({
      config: {
        forward: ["dataLayer.push"],
      },
    })
  ],
  markdown: {
    remarkPlugins: [remarkToc, customRemarkPlugin],
    rehypePlugins: [[rehypeExternalLinks, {target: '_blank', ref: 'nofollow'}]],
  },
});
