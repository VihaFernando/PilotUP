# PilotUP SEO Setup

This project is configured for search and social visibility.

## What’s in place

- **Default meta & schema** – `index.html` has title, description, canonical, Open Graph, Twitter Card, and SoftwareApplication JSON-LD.
- **Per-page meta** – `react-helmet-async` + `SEO.jsx` set unique title, description, canonical, OG, Twitter, and JSON-LD on:
  - Homepage (SoftwareApplication)
  - Blog list (`/blog`)
  - Blog posts (`/blog/:slug`) (BlogPosting)
- **robots.txt** – `public/robots.txt` allows all crawlers and points to the sitemap.
- **Sitemap** – `npm run prebuild` (runs before `npm run build`) generates `public/sitemap.xml` from Supabase blog slugs. Homepage, `/blog`, and all `/blog/[slug]` are included.
- **Prerender (optional)** – `npm run prerender` (run after build) uses Puppeteer to generate static HTML for `/`, `/blog`, and each blog post. Netlify serves these when present, so crawlers get fully rendered HTML.

## Build commands

- **Standard:** `npm run build`  
  - Runs `prebuild` → generates sitemap  
  - Runs Vite build → outputs `dist/`

- **With prerender:** `npm run build && npm run prerender`  
  - Same as above, then writes prerendered HTML into `dist/` for key routes.  
  - Use this in Netlify (or set `build` to `npm run build && npm run prerender`) if you want crawlers to get static HTML.

## Domain and env

- Canonical and sitemap URLs use **https://pilotup.io**. Change `SITE_URL` in `src/components/SEO.jsx` and in `scripts/generate-sitemap.js` if your domain differs.
- Sitemap generation needs `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env` or `.env.local` so blog slugs can be fetched at build time.

## Next steps (your side)

1. **Google Search Console** – Add the property and submit `https://pilotup.io/sitemap.xml`.
2. **GA4** – Already wired; confirm in Reports.
3. **Bing Webmaster Tools** – Add site and sitemap.
4. **Netlify** – To enable prerender on deploy, set build command to:  
   `npm run build && npm run prerender`.  
   (Or use Netlify Prerender / Prerender.io if you prefer a service.)
