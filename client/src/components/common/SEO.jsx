import { Helmet } from 'react-helmet-async';
import { useSite } from '../../context/SiteContext';
import { SITE_URL } from '../../lib/api';

export default function SEO({ title, description, image, type = 'website', path, noindex = false, jsonLd }) {
  const { seo, settings } = useSite();
  const siteName = settings.siteName || '';
  const template = seo.titleTemplate || `%s | ${siteName}`;
  const fullTitle = title ? template.replace('%s', title) : seo.defaultTitle || siteName;
  const desc = description || seo.description || '';
  const url = SITE_URL + (path ?? window.location.pathname);
  const og = image || seo.ogImage;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      {og && <meta property="og:image" content={og} />}
      <meta name="twitter:card" content={og ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {og && <meta name="twitter:image" content={og} />}
      {seo.twitterHandle && <meta name="twitter:site" content={seo.twitterHandle} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
