/**
 * Build-time script: fetches blog slugs from Supabase and writes public/sitemap.xml.
 * Run before or during build so sitemap is included in dist.
 * Requires VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env or .env.local.
 */
import 'dotenv/config';
import { config as loadEnvLocal } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

loadEnvLocal({ path: '.env.local' });

const SITE_URL = 'https://pilotup.io';
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const outPath = join(publicDir, 'sitemap.xml');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('generate-sitemap: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY missing, writing sitemap with static routes only.');
}

async function getBlogSlugs() {
  if (!supabaseUrl || !supabaseAnonKey) return [];
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase
      .from('blogs')
      .select('slug, updated_at, created_at')
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return (data || []).map((row) => ({
      slug: row.slug,
      lastmod: (row.updated_at || row.created_at || '').slice(0, 10),
    }));
  } catch (e) {
    console.warn('generate-sitemap: failed to fetch blogs', e.message);
    return [];
  }
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function main() {
  const slugs = await getBlogSlugs();

  const urls = [
    { loc: `${SITE_URL}/`, changefreq: 'weekly', priority: '1.0' },
    { loc: `${SITE_URL}/blog`, changefreq: 'weekly', priority: '0.9' },
    ...slugs.map(({ slug, lastmod }) => ({
      loc: `${SITE_URL}/blog/${escapeXml(slug)}`,
      lastmod: lastmod || null,
      changefreq: 'monthly',
      priority: '0.8',
    })),
  ];

  const urlEntries = urls
    .map(
      (u) =>
        `  <url>\n` +
        `    <loc>${u.loc}</loc>\n` +
        (u.lastmod ? `    <lastmod>${u.lastmod}</lastmod>\n` : '') +
        `    <changefreq>${u.changefreq}</changefreq>\n` +
        `    <priority>${u.priority}</priority>\n` +
        `  </url>`
    )
    .join('\n');

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urlEntries +
    '\n</urlset>';

  writeFileSync(outPath, xml, 'utf8');
  console.log(`generate-sitemap: wrote ${urls.length} URLs to public/sitemap.xml`);
}

main().catch((err) => {
  console.error('generate-sitemap error:', err);
  process.exit(1);
});
