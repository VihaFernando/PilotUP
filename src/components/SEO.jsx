import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://pilotup.ai';
const SITE_NAME = 'PilotUP';
const DEFAULT_DESCRIPTION = 'Build your own, AI employees to scale your business. PilotUP helps you automate workflows with an AI workforce.';

/**
 * SEO component: sets title, description, canonical, OG, Twitter, and optional JSON-LD.
 * Use on every public page so crawlers and social previews get correct meta.
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  canonicalPath = '/',
  ogImage = `${SITE_URL}/favicon.ico`,
  ogType = 'website',
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} – Build your own AI employees to scale your business`;
  const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  );
}

export { SITE_URL, SITE_NAME, DEFAULT_DESCRIPTION };
