import Section from './Section';
import SectionHeading from '../../components/common/SectionHeading';
import BlogCard from '../../components/common/BlogCard';
import { useItems } from '../../hooks';
import { useT } from '../../i18n';

export default function FeaturedBlog() {
  const { t } = useT();
  const q = useItems('blogs-home', '/blogs', { limit: 3 });
  if (!q.items.length) return null;
  return (
    <Section id="blog">
      <SectionHeading title="Latest writing" text="Notes on things I built, broke and learned." action={{ to: '/blog', label: t('viewAll') }} />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{q.items.map((b) => <BlogCard key={b._id} post={b} />)}</div>
    </Section>
  );
}
