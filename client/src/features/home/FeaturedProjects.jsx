import Section from './Section';
import SectionHeading from '../../components/common/SectionHeading';
import ProjectCard from '../../components/common/ProjectCard';
import { QueryBoundary, EmptyState } from '../../components/ui/States';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { useItems } from '../../hooks';
import { useT } from '../../i18n';

export default function FeaturedProjects() {
  const { t } = useT();
  const q = useItems('projects-featured', '/projects', { limit: 3, sort: 'featured' });
  return (
    <Section id="projects">
      <SectionHeading title="Selected projects" text="A few things I have built, with the reasoning behind them." action={{ to: '/projects', label: t('viewAll') }} />
      <QueryBoundary query={q} skeleton={<GridSkeleton count={3} />} isEmpty={!q.items.length} empty={<EmptyState title="Projects are on the way" text="Published projects will appear here." />}>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{q.items.map((p) => <ProjectCard key={p._id} project={p} />)}</div>
      </QueryBoundary>
    </Section>
  );
}
