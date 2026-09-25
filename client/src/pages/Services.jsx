import SEO from '../components/common/SEO';
import PageHeader from '../components/common/PageHeader';
import Section from '../features/home/Section';
import { ServiceGrid } from '../features/home/ServicesSection';
import WorkWithMe from '../features/home/WorkWithMe';
import { QueryBoundary, EmptyState } from '../components/ui/States';
import { GridSkeleton } from '../components/ui/Skeleton';
import { useItems } from '../hooks';

export default function Services() {
  const q = useItems('services', '/services', { limit: 20 });
  return (
    <>
      <SEO title="Services" description="Full-stack, MERN, React and API development services." path="/services" />
      <PageHeader title="Services" text="How I can help with your product, team or idea." />
      <Section className="!pt-4">
        <QueryBoundary query={q} skeleton={<GridSkeleton count={4} />} isEmpty={!q.items.length} empty={<EmptyState title="Services coming soon" />}>
          <ServiceGrid items={q.items} />
        </QueryBoundary>
      </Section>
      <WorkWithMe />
    </>
  );
}
