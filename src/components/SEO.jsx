import { useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://pilotup.io';
const SITE_NAME = 'PilotUP';
const META_DESCRIPTION_MAX_LENGTH = 155;
const SEO_MARKER = 'data-pilotup-seo';

/**
 * Strip HTML, newlines, and common entities; truncate to ~155 chars for meta description.
 */
function cleanDescription(raw) {
  if (raw == null || typeof raw !== 'string') return '';
  let text = raw
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .trim();
  if (text.length > META_DESCRIPTION_MAX_LENGTH) {
    text = text.slice(0, META_DESCRIPTION_MAX_LENGTH - 3).trim() + '...';
  }
  return text;
}

function setOrUpdateMeta(head, attrs, marker) {
  const isProperty = 'property' in attrs;
  const selector = isProperty
    ? `meta[property="${attrs.property}"]`
    : `meta[name="${attrs.name}"]`;
  head.querySelectorAll(selector).forEach((el) => el.remove());
  const el = document.createElement('meta');
  el.setAttribute(SEO_MARKER, 'true');
  Object.entries(attrs).forEach(([key, value]) => {
    if (value != null && value !== '') el.setAttribute(key, String(value));
  });
  head.appendChild(el);
}

function setOrUpdateLink(head, rel, href, marker) {
  head.querySelectorAll(`link[rel="${rel}"]`).forEach((el) => el.remove());
  const el = document.createElement('link');
  el.setAttribute(SEO_MARKER, 'true');
  el.setAttribute('rel', rel);
  el.setAttribute('href', href);
  head.appendChild(el);
}

function setOrUpdateScript(head, id, json, marker) {
  const existing = head.querySelector(`script#${id}`);
  if (existing) existing.remove();
  const el = document.createElement('script');
  el.setAttribute('type', 'application/ld+json');
  el.id = id;
  el.setAttribute(SEO_MARKER, 'true');
  el.textContent = json;
  head.appendChild(el);
}

function removeSeoTags(head, marker) {
  head.querySelectorAll(`[${marker}]`).forEach((el) => el.remove());
}

/**
 * Injects title via Helmet (works) and meta/link/script directly into document.head
 * so they always appear. One <Seo /> per page = no duplicates.
 */
function Seo({
  title,
  fullTitle: fullTitleProp,
  description,
  canonical,
  ogImage,
  type = 'website',
  schema = null,
}) {
  const cleanDesc = cleanDescription(description);
  const canonicalUrl = canonical === '/' || !canonical
    ? SITE_URL
    : `${SITE_URL}${canonical.startsWith('/') ? canonical : `/${canonical}`}`;
  const fullTitle = fullTitleProp ?? (title ? `${title} | ${SITE_NAME}` : SITE_NAME);
  const imageUrl = ogImage || `${SITE_URL}/favicon.ico`;

  useLayoutEffect(() => {
    const head = document.head;
    if (!head) return;

    removeSeoTags(head, SEO_MARKER);

    setOrUpdateLink(head, 'canonical', canonicalUrl, SEO_MARKER);

    if (cleanDesc) {
      setOrUpdateMeta(head, { name: 'description', content: cleanDesc }, SEO_MARKER);
    }
    setOrUpdateMeta(head, { property: 'og:type', content: type }, SEO_MARKER);
    setOrUpdateMeta(head, { property: 'og:url', content: canonicalUrl }, SEO_MARKER);
    setOrUpdateMeta(head, { property: 'og:title', content: fullTitle }, SEO_MARKER);
    if (cleanDesc) {
      setOrUpdateMeta(head, { property: 'og:description', content: cleanDesc }, SEO_MARKER);
    }
    setOrUpdateMeta(head, { property: 'og:image', content: imageUrl }, SEO_MARKER);
    setOrUpdateMeta(head, { property: 'og:site_name', content: SITE_NAME }, SEO_MARKER);
    setOrUpdateMeta(head, { name: 'twitter:card', content: 'summary' }, SEO_MARKER);
    setOrUpdateMeta(head, { name: 'twitter:title', content: fullTitle }, SEO_MARKER);
    if (cleanDesc) {
      setOrUpdateMeta(head, { name: 'twitter:description', content: cleanDesc }, SEO_MARKER);
    }
    if (schema != null) {
      setOrUpdateScript(head, 'pilotup-ldjson', JSON.stringify(schema), SEO_MARKER);
    }

    return () => {
      removeSeoTags(head, SEO_MARKER);
    };
  }, [fullTitle, cleanDesc, canonicalUrl, type, imageUrl, schema]);

  return (
    <Helmet defer={false}>
      <title>{fullTitle}</title>
    </Helmet>
  );
}

export default Seo;
export { SITE_URL, SITE_NAME, cleanDescription };
