import { Suspense } from 'react';
import SEO from '../components/common/SEO';
import HeroSection from '../features/home/HeroSection';
import { homeSections } from '../features/home/sections';
import { useSite } from '../context/SiteContext';
import { SITE_URL } from '../lib/api';

export default function Home() {
  const { settings, profile, hero, socialLinks } = useSite();
  const order = settings.homepageSections?.length ? settings.homepageSections : Object.keys(homeSections).map((key) => ({ key, enabled: true }));
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: hero.roleTitle || profile.title,
    url: SITE_URL,
    address: profile.location,
    sameAs: socialLinks.filter((s) => s.url).map((s) => s.url),
  };
  return (
    <>
      <SEO path="/" jsonLd={jsonLd} />
      <HeroSection />
      {order
        .filter((s) => s.enabled !== false && homeSections[s.key])
        .map((s) => {
          const Section = homeSections[s.key];
          return (
            <Suspense key={s.key} fallback={<div className="h-40" aria-hidden="true" />}>
              <Section />
            </Suspense>
          );
        })}
    </>
  );
}
