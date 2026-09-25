import { Mail, MapPin, Clock } from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/common/PageHeader';
import ContactForm from '../features/contact/ContactForm';
import SocialLinks from '../components/common/SocialLinks';
import { useSite } from '../context/SiteContext';

export default function Contact() {
  const { profile, socialLinks, settings, hero } = useSite();
  const w = settings.workWithMe || {};
  return (
    <>
      <SEO title="Contact" description="Get in touch for jobs, freelance work or collaboration." path="/contact" />
      <PageHeader title="Let’s talk" text={settings.contactCta?.text} />
      <div className="container-x grid gap-10 pb-10 lg:grid-cols-[1fr_320px]">
        <ContactForm />
        <aside className="space-y-6 text-sm">
          {hero.availabilityStatus && <p className="inline-flex items-center gap-2 text-muted"><span className="h-2 w-2 animate-pulseDot rounded-full bg-ok" aria-hidden="true" />{hero.availabilityText}</p>}
          <ul className="space-y-4">
            {profile.email && <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 text-accent" /><a href={`mailto:${profile.email}`} className="link-underline">{profile.email}</a></li>}
            {profile.location && <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 text-accent" />{profile.location}</li>}
            {w.responseTime && <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 text-accent" />Replies {w.responseTime.toLowerCase()}</li>}
          </ul>
          <SocialLinks links={socialLinks} />
        </aside>
      </div>
    </>
  );
}
