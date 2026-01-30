/**
 * Optional post-build script: prerenders /, /blog, and /blog/[slug] to static HTML
 * so crawlers get fully rendered content. Run after build: npm run build && npm run prerender
 *
 * Writes: dist/index.html (home), dist/blog/index.html, dist/blog/<slug>/index.html
 * Netlify serves these files when they exist (static files take precedence over SPA redirect).
 */
import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import pathModule from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import serveHandler from 'serve-handler';
import puppeteer from 'puppeteer';

const __dirname = pathModule.dirname(fileURLToPath(import.meta.url));
const rootDir = pathModule.join(__dirname, '..');
const distDir = pathModule.join(rootDir, 'dist');

const PORT = 34567;
const BASE = `http://localhost:${PORT}`;

// Parse sitemap to get blog slugs (avoid Supabase in prerender)
function getRoutesFromSitemap() {
  const sitemapPath = pathModule.join(rootDir, 'public', 'sitemap.xml');
  let xml;
  try {
    xml = readFileSync(sitemapPath, 'utf8');
  } catch {
    return ['/', '/blog'];
  }
  const slugs = [];
  const locRegex = /<loc>https:\/\/[^<]+<\/loc>/g;
  let m;
  while ((m = locRegex.exec(xml)) !== null) {
    const url = m[0].replace(/<\/?loc>/g, '');
    const path = url.replace('https://pilotup.ai', '') || '/';
    if (path.startsWith('/blog/') && path !== '/blog') {
      slugs.push(path);
    }
  }
  return ['/', '/blog', ...slugs];
}

function createServerAsync(distDir) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      serveHandler(req, res, {
        public: distDir,
        cleanUrls: false,
        rewrites: [{ source: '**', destination: '/index.html' }],
      });
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function main() {
  const routes = getRoutesFromSitemap();
  console.log('prerender: routes', routes);

  const server = await createServerAsync(distDir);
  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.setUserAgent(
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    );

    for (const route of routes) {
      const url = `${BASE}${route}`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      await page.waitForSelector('#root', { timeout: 5000 });
      await new Promise((r) => setTimeout(r, 1500));
      const html = await page.content();

      const filePath =
        route === '/'
          ? pathModule.join(distDir, 'index.html')
          : pathModule.join(distDir, route.slice(1), 'index.html');
      mkdirSync(pathModule.dirname(filePath), { recursive: true });
      writeFileSync(filePath, html, 'utf8');
      console.log('prerender: wrote', filePath);
    }
  } finally {
    await browser.close();
    server.close();
  }

  console.log('prerender: done');
}

main().catch((err) => {
  console.error('prerender error:', err);
  process.exit(1);
});
