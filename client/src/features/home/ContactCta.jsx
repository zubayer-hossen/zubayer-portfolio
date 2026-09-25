import Section from './Section';
import Button from '../../components/ui/Button';
import { useSite } from '../../context/SiteContext';
import { useT } from '../../i18n';

export default function ContactCta() {
  const { settings, profile } = useSite();
  const { t } = useT();
  const c = settings.contactCta || {};
  return (
    <Section id="contact-cta" tone="alt">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="h-section">{c.title}</h2>
        <p className="lead mx-auto mt-4">{c.text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/contact" magnetic>{t('contactMe')}</Button>
          {profile.email && <Button href={`mailto:${profile.email}`} variant="secondary">{profile.email}</Button>}
        </div>
      </div>
    </Section>
  );
}
