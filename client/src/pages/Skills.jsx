import SEO from '../components/common/SEO';
import PageHeader from '../components/common/PageHeader';
import SkillsShowcase from '../features/skills/SkillsShowcase';
import TechMarquee from '../features/home/TechMarquee';

export default function Skills() {
  return (
    <>
      <SEO title="Skills" description="Technologies and tools I use to build full-stack web applications." path="/skills" />
      <PageHeader title="Skills and technologies" text="Select a skill to see how I use it and which projects it appears in." />
      <div className="container-x pb-6"><SkillsShowcase /></div>
      <TechMarquee />
    </>
  );
}
