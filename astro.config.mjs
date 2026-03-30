// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

/** Vite plugin that serves generated PDFs from dist/ during dev */
function serveDistPdfs() {
  return {
    name: 'serve-dist-pdfs',
    configureServer(/** @type {import('vite').ViteDevServer} */ server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.endsWith('.pdf')) {
          const filePath = path.join(process.cwd(), 'dist', req.url);
          if (fs.existsSync(filePath)) {
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline');
            fs.createReadStream(filePath).pipe(res);
            return;
          }
        }
        next();
      });
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://jordangarrison.dev',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss(), serveDistPdfs()],
  },
});
